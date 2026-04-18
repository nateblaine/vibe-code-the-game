// All derived stat calculations live here. Never put formulas in scenes or components.

import type { GameState, DerivedBlock } from '../types/state';
import type { StatModifier } from '../types/content';
import { UPGRADES } from '../content/upgrades';
import { PERSONAS } from '../content/personas';
import { STARTER_TOOLS } from '../content/starterTools';
import { SKILLS } from '../content/skills';

// Base values before any modifiers
const BASE = {
  agentCapacity: 3,
  automationLevel: 0,
  computePerTick: 20, // compute regenerated per tick
  focusPerTick: 0,    // focus does not regenerate passively; upgrades/events change it
  burnRate: 5,        // base burn per tick (in $)
  stability: 1.0,
  hypeMultiplier: 1.0,
};

// Collect all active StatModifiers from: persona, tool, skills, upgrades owned, temp modifiers
function collectModifiers(state: GameState): StatModifier[] {
  const mods: StatModifier[] = [];

  const persona = PERSONAS.find(p => p.id === state.selectedPersonaId);
  if (persona) {
    mods.push(...persona.bonuses, ...persona.weaknesses);
  }

  const tool = STARTER_TOOLS.find(t => t.id === state.selectedToolId);
  if (tool) {
    mods.push(...tool.effects);
  }

  for (const skillId of state.selectedSkillIds) {
    const skill = SKILLS.find(s => s.id === skillId);
    if (skill) mods.push(...skill.effects);
  }

  for (const upgradeId of state.upgradesOwned) {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (upgrade) mods.push(...upgrade.effects);
  }

  for (const mod of state.temporaryModifiers) {
    if (mod.expiresAtTick === null || mod.expiresAtTick > state.tickCount) {
      mods.push({ type: mod.type, stat: mod.stat as StatModifier['stat'], value: mod.value });
    }
  }

  return mods;
}

export function getStatMultiplier(state: GameState, stat: string, base = 1): number {
  return applyModifiers(base, stat, collectModifiers(state));
}

// Apply all modifiers for a given stat to a base value.
// Flat mods add first, then multiplier mods compound.
export function applyModifiers(base: number, stat: string, mods: StatModifier[]): number {
  let result = base;

  // Flat additions first
  for (const mod of mods) {
    if (mod.stat === stat && mod.type === 'flat') {
      result += mod.value;
    }
  }

  // Multipliers compound
  for (const mod of mods) {
    if (mod.stat === stat && mod.type === 'multiplier') {
      result *= 1 + mod.value;
    }
  }

  return result;
}

// Calculate all derived stats from current game state
export function calcDerived(state: GameState): DerivedBlock {
  const mods = collectModifiers(state);

  const agentCapacity = Math.floor(applyModifiers(BASE.agentCapacity, 'agentCapacity', mods));
  const automationLevel = Math.max(0, applyModifiers(BASE.automationLevel, 'automationLevel', mods));
  const stability = Math.max(0, Math.min(2, applyModifiers(BASE.stability, 'stability', mods)));
  const hypeMultiplier = Math.max(0.1, applyModifiers(BASE.hypeMultiplier, 'hypeMultiplier', mods));
  const computeEfficiency = Math.max(0.25, applyModifiers(1.0, 'computeEfficiency', mods));
  const totalAssignedCapacity = state.activeIdeaIds.reduce(
    (sum, ideaId) => sum + (state.ideas[ideaId]?.assignedCapacity ?? 0),
    0
  );

  // Burn rate only exists when capacity is actually allocated.
  // If nothing is running, the player should not bleed cash.
  let burnRate = 0;
  if (totalAssignedCapacity > 0) {
    burnRate = applyModifiers(BASE.burnRate, 'burnRate', mods);
  }
  // Each active idea adds burn proportional to assigned capacity
  for (const ideaId of state.activeIdeaIds) {
    const idea = state.ideas[ideaId];
    if (idea && idea.assignedCapacity > 0) {
      burnRate += (idea.assignedCapacity * 0.5) / computeEfficiency;
    }
  }
  burnRate = Math.max(0, burnRate);

  // Income: sum of MRR across active ideas in launch+ stages (converted to per-tick)
  // MRR is monthly; game tick is 1 second. Real conversion: MRR / (30 * 24 * 3600).
  // We use a gameplay-tuned factor instead: MRR / 300 per tick so games feel right.
  let incomePerTick = 0;
  for (const ideaId of state.activeIdeaIds) {
    const idea = state.ideas[ideaId];
    if (idea && idea.mrr > 0 && idea.stage !== 'concept' && idea.stage !== 'prototype') {
      incomePerTick += calcIncomePerTickFromMrr(state, idea.mrr);
    }
  }

  const netPerTick = incomePerTick - burnRate;

  return {
    burnRate,
    agentCapacity,
    automationLevel,
    stability,
    hypeMultiplier,
    incomePerTick,
    netPerTick,
  };
}

// Compute the quality multiplier for an idea (used in milestone progression)
export function calcQualityMultiplier(state: GameState): number {
  const mods = collectModifiers(state);
  return Math.max(0.5, applyModifiers(1.0, 'qualityMultiplier', mods));
}

// Compute the effective progress per tick for an idea
export function calcIdeaProgressPerTick(
  state: GameState,
  ideaId: string,
  progressPerCapacity: number
): number {
  const idea = state.ideas[ideaId];
  if (!idea || idea.assignedCapacity === 0) return 0;
  const mods = collectModifiers(state);
  const multiplier = applyModifiers(1.0, 'ideaProgress', mods);
  return idea.assignedCapacity * progressPerCapacity * multiplier;
}

export function calcIncomePerTickFromMrr(state: GameState, mrr: number): number {
  const mods = collectModifiers(state);
  const directMonetization = Math.max(0.1, applyModifiers(1.0, 'directMonetization', mods));
  return (mrr / 300) * directMonetization;
}

export function calcUpgradeCost(state: GameState, baseCost: number): number {
  const discountMultiplier = Math.max(0.5, getStatMultiplier(state, 'upgradeDiscount', 1.0));
  return Math.max(0, Math.ceil(baseCost * (2 - discountMultiplier)));
}

// Check if the win condition is met
export function calcWinScore(state: GameState): number {
  return state.resources.cash + state.meta.totalEarned + state.meta.valuationBonus;
}

export const WIN_THRESHOLD = 1_000_000;
