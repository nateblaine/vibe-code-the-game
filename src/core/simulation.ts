// Per-tick simulation logic. Pure function: (state) => state.
// No React, no side effects, no randomness outside of eventEngine.

import type { GameState, LogEntry } from '../types/state';
import type { EventChoice, IdeaStage } from '../types/content';
import { EVENTS } from '../content/events';
import { IDEAS } from '../content/ideas';
import { UPGRADES } from '../content/upgrades';
import { calcDerived, calcIdeaProgressPerTick, calcQualityMultiplier, calcUpgradeCost, calcIncomePerTickFromMrr, getStatMultiplier } from './formulas';
import { checkIdeaStageAdvance, checkWin, checkSoftLoss } from './progression';
import { rollForEvent } from './eventEngine';
import { saveGame } from './saveSystem';

const AUTO_SAVE_INTERVAL = 30; // ticks

// Stage-specific MRR growth rates (multiplicative per tick)
const STAGE_MRR_GROWTH: Record<IdeaStage, number> = {
  concept: 0,
  prototype: 0,
  launch: 0.002,  // small initial ramp
  growth: 0.005,  // active growth phase
  scale: 0.003,   // slower but steady
  plateau: 0.001, // minimal organic
};

// Debt impact on focus (per tick when debt is high)
function debtFocusPenalty(technicalDebt: number): number {
  if (technicalDebt < 20) return 0;
  if (technicalDebt < 50) return 0.05;
  if (technicalDebt < 80) return 0.15;
  return 0.3; // severe
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function applyReputationDelta(state: GameState, delta: number): number {
  if (delta <= 0) return delta;
  return delta * getStatMultiplier(state, 'reputationGain', 1.0);
}

function applyPermanentModifier(state: GameState, eventId: string, stat: string, value: number) {
  state.temporaryModifiers = [
    ...state.temporaryModifiers,
    {
      id: `${eventId}-${stat}-${state.tickCount}-${state.temporaryModifiers.length}`,
      stat,
      type: 'flat',
      value,
      expiresAtTick: null,
      source: eventId,
    },
  ];
}

function scoreEventChoice(choice: EventChoice): number {
  let score = 0;

  for (const effect of choice.effects) {
    const weight = (() => {
      switch (effect.stat) {
        case 'cash':
          return 1 / 50;
        case 'compute':
          return 1 / 4;
        case 'focus':
          return 1.5;
        case 'reputation':
          return 2;
        case 'technicalDebt':
          return -1.8;
        case 'burnRate':
          return -12;
        case 'stability':
          return 40;
        case 'automationLevel':
          return 25;
        case 'qualityMultiplier':
          return 50;
        case 'directMonetization':
          return 45;
        case 'ideaProgress':
          return 45;
        case 'hypeMultiplier':
          return 30;
        default:
          return effect.type === 'multiplier' ? 25 : 8;
      }
    })();

    score += effect.type === 'multiplier' ? effect.value * weight * 100 : effect.value * weight;
  }

  return score;
}

function autoResolveEvent(state: GameState, eventId: string): GameState {
  const event = EVENTS.find(candidate => candidate.id === eventId);
  if (!event) return state;

  let bestChoiceIndex = 0;
  let bestScore = -Infinity;

  event.choices.forEach((choice, index) => {
    const score = scoreEventChoice(choice);
    if (score > bestScore) {
      bestScore = score;
      bestChoiceIndex = index;
    }
  });

  const choice = event.choices[bestChoiceIndex];
  return applyEventChoice(state, eventId, bestChoiceIndex, choice.logMessage, choice.effects);
}

export function tick(state: GameState): GameState {
  // Work on a shallow clone — we reassign properties rather than deep-cloning.
  // For arrays/objects we create new instances only where we modify them.
  let s: GameState = { ...state };
  s.resources = { ...state.resources };
  s.derived = { ...state.derived };
  s.meta = { ...state.meta };
  s.ideas = { ...state.ideas };
  s.log = state.log; // will be replaced if we add entries

  const newLog: LogEntry[] = [];

  s.tickCount += 1;
  s.lastTickAt = Date.now();

  // 1. Recalculate derived stats
  s.derived = calcDerived(s);
  const qualityMult = calcQualityMultiplier(s);

  // 2 & 3. Apply passive income + compute/focus allocation to each active idea
  for (const ideaId of s.activeIdeaIds) {
    const ideaDef = IDEAS.find(i => i.id === ideaId);
    if (!ideaDef) continue;

    const idea = { ...s.ideas[ideaId] };

    // Progress toward next stage
    const progressGain = calcIdeaProgressPerTick(s, ideaId, ideaDef.progressPerCapacity);
    idea.progress += progressGain;

    // 4. Progress idea milestones
    const newStage = checkIdeaStageAdvance(s, ideaId, ideaDef.stageThresholds);
    if (newStage && newStage !== idea.stage) {
      idea.stage = newStage;

      // Set initial MRR on launch
      if (newStage === 'launch') {
        idea.mrr = ideaDef.mrrAtLaunch;
        idea.quality = clamp(qualityMult, 0.5, 2);
        s.resources.reputation += applyReputationDelta(s, 5);
        const launchIncomePerTick = calcIncomePerTickFromMrr(s, idea.mrr);
        newLog.push({
          tick: s.tickCount,
          message: `${ideaDef.name} reached Launch stage. Income: $${launchIncomePerTick.toFixed(2)}/tick`,
          type: 'milestone',
        });
      } else if (newStage === 'growth') {
        newLog.push({ tick: s.tickCount, message: `${ideaDef.name} entering Growth phase.`, type: 'milestone' });
      } else if (newStage === 'scale') {
        newLog.push({ tick: s.tickCount, message: `${ideaDef.name} at Scale. High value, high maintenance.`, type: 'milestone' });
      } else if (newStage === 'plateau') {
        newLog.push({ tick: s.tickCount, message: `${ideaDef.name} has plateaued. Consider what's next.`, type: 'warning' });
      }
    }

    // MRR growth in live stages
    const mrrGrowthRate = STAGE_MRR_GROWTH[idea.stage] * s.derived.hypeMultiplier;
    if (mrrGrowthRate > 0) {
      idea.mrr *= (1 + mrrGrowthRate);
    }

    // Passive income from MRR (per tick, see formula comment in formulas.ts)
    if (idea.mrr > 0 && idea.stage !== 'concept' && idea.stage !== 'prototype') {
      const incomePerTick = calcIncomePerTickFromMrr(s, idea.mrr);
      s.resources.cash += incomePerTick;
      s.meta.totalEarned += incomePerTick;
    }

    // Maintenance load
    idea.maintenanceLoad = ideaDef.maintenanceLoad;

    s.ideas[ideaId] = idea;
  }

  // 5. Apply ongoing effects from upgrades and temporary modifiers
  // (Derived stats handle upgrade effects; here we expire temp modifiers)
  s.temporaryModifiers = state.temporaryModifiers.filter(
    mod => mod.expiresAtTick === null || mod.expiresAtTick > s.tickCount
  );

  // 6. Technical debt
  let debtGain = 0;
  const debtGainMultiplier = Math.max(0, getStatMultiplier(s, 'debtGainRate', 1.0));
  for (const ideaId of s.activeIdeaIds) {
    const ideaDef = IDEAS.find(i => i.id === ideaId);
    if (ideaDef && s.ideas[ideaId]?.assignedCapacity > 0) {
      debtGain += ideaDef.debtGainRate * debtGainMultiplier;
    }
  }
  s.resources.technicalDebt = clamp(s.resources.technicalDebt + debtGain, 0, 100);

  // High debt penalizes focus
  const focusPenalty = debtFocusPenalty(s.resources.technicalDebt);
  if (focusPenalty > 0) {
    s.resources.focus = clamp(s.resources.focus - focusPenalty, 0, 100);
  }

  // 7. Apply burn rate
  s.resources.cash -= s.derived.burnRate;

  // Track burn warning (consecutive ticks burn > income)
  if (s.derived.netPerTick < 0) {
    s.meta.burnWarningTicks += 1;
  } else {
    s.meta.burnWarningTicks = 0;
  }

  // Natural focus regeneration (slow)
  s.resources.focus = clamp(s.resources.focus + 0.02, 0, 100);

  // 8. Roll for event
  if (s.pendingEvent === null) {
    const eventId = rollForEvent(s);
    if (eventId) {
      s.pendingEvent = eventId;
      s.cooldowns = { ...s.cooldowns, [eventId]: s.tickCount };
      newLog.push({
        tick: s.tickCount,
        message: `Event queued: ${EVENTS.find(event => event.id === eventId)?.title ?? eventId}`,
        type: 'event',
      });

      if (s.settings.autoAcceptEnabled) {
        s = autoResolveEvent(s, eventId);
      }
    }
  }

  // 9. Check win / loss
  if (!s.meta.winCondition && checkWin(s)) {
    s.meta.winCondition = 'million';
    newLog.push({ tick: s.tickCount, message: 'WIN CONDITION MET — $1,000,000', type: 'milestone' });
  }
  if (!s.meta.lossCondition) {
    const loss = checkSoftLoss(s);
    if (loss) {
      s.meta.lossCondition = loss;
      newLog.push({ tick: s.tickCount, message: `Warning: ${loss} condition critical.`, type: 'warning' });
    }
  }

  // Append new log entries
  if (newLog.length > 0) {
    // Keep log capped at 200 entries
    s.log = [...newLog, ...s.log].slice(0, 200);
  }

  // 10. Auto-save every N ticks
  if (s.tickCount % AUTO_SAVE_INTERVAL === 0) {
    saveGame(s);
  }

  return s;
}

// Apply the effects of an event choice to the state.
// Called when the player makes a choice in the EventModal.
export function applyEventChoice(
  state: GameState,
  eventId: string,
  choiceIndex: number,
  logMessage: string,
  effects: Array<{ type: 'flat' | 'multiplier'; stat: string; value: number }>
): GameState {
  const s: GameState = { ...state };
  s.resources = { ...state.resources };
  s.meta = { ...state.meta };
  s.eventHistory = [...state.eventHistory, eventId];
  s.pendingEvent = null;
  s.temporaryModifiers = [...state.temporaryModifiers];

  for (const effect of effects) {
    if (effect.type === 'flat') {
      const res = s.resources as unknown as Record<string, number>;
      if (effect.stat in res) {
        const delta = effect.stat === 'reputation' ? applyReputationDelta(s, effect.value) : effect.value;
        res[effect.stat] = (res[effect.stat] ?? 0) + delta;
      } else {
        applyPermanentModifier(s, eventId, effect.stat, effect.value);
      }
    }
    // Multiplier effects from events are applied as temporary modifiers (30-tick duration)
    if (effect.type === 'multiplier') {
      s.temporaryModifiers = [
        ...s.temporaryModifiers,
        {
          id: `${eventId}-choice${choiceIndex}-${s.tickCount}`,
          stat: effect.stat,
          type: 'multiplier',
          value: effect.value,
          expiresAtTick: s.tickCount + 30,
          source: eventId,
        },
      ];
    }
  }

  // Clamp resources to reasonable bounds
  s.resources.focus = Math.min(100, s.resources.focus);
  s.resources.technicalDebt = Math.max(0, Math.min(100, s.resources.technicalDebt));

  s.log = [
    { tick: s.tickCount, message: logMessage, type: 'event' as const },
    ...state.log,
  ].slice(0, 200);

  s.derived = calcDerived(s);

  return s;
}

// Apply upgrade purchase
export function applyUpgradePurchase(state: GameState, upgradeId: string): GameState {
  const upgrade = UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade) return state;
  const actualCost = calcUpgradeCost(state, upgrade.cost);
  if (state.resources.cash < actualCost) return state;
  if (state.upgradesOwned.includes(upgradeId)) return state;

  // Check requirements
  if (upgrade.requires) {
    for (const reqId of upgrade.requires) {
      if (!state.upgradesOwned.includes(reqId)) return state;
    }
  }

  const s: GameState = { ...state };
  s.resources = { ...state.resources, cash: state.resources.cash - actualCost };
  s.upgradesOwned = [...state.upgradesOwned, upgradeId];
  s.log = [
    { tick: s.tickCount, message: `Purchased: ${upgrade.name} for $${actualCost.toLocaleString()}`, type: 'upgrade' as const },
    ...(upgrade.id === 'auto-triage-queue'
      ? [{ tick: s.tickCount, message: 'Auto-Triage Queue unlocked in Settings.', type: 'upgrade' as const }]
      : []),
    ...state.log,
  ].slice(0, 200);
  s.derived = calcDerived(s);

  return s;
}

// Adjust capacity assignment for an idea (+1 or -1)
export function adjustIdeaCapacity(state: GameState, ideaId: string, delta: number): GameState {
  const idea = state.ideas[ideaId];
  if (!idea) return state;

  const totalAssigned = state.activeIdeaIds.reduce(
    (sum, id) => sum + (state.ideas[id]?.assignedCapacity ?? 0),
    0
  );
  const maxCapacity = state.derived.agentCapacity;

  const newCapacity = clamp(idea.assignedCapacity + delta, 0, maxCapacity);
  const capacityDelta = newCapacity - idea.assignedCapacity;

  // Don't exceed total agent capacity
  if (capacityDelta > 0 && totalAssigned >= maxCapacity) return state;

  return {
    ...state,
    ideas: {
      ...state.ideas,
      [ideaId]: { ...idea, assignedCapacity: newCapacity },
    },
  };
}
