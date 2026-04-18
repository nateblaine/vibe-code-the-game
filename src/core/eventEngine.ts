import type { GameState } from '../types/state';
import type { EventDefinition, TriggerCondition } from '../types/content';
import { EVENTS } from '../content/events';
import { createRng, weightedPick } from './rng';

// Minimum ticks between any player-facing events (30 seconds at 1 tick/sec)
export const MIN_EVENT_INTERVAL = 30;
// Maximum interval before an event is forced (90 seconds)
export const MAX_EVENT_INTERVAL = 90;
export const FIRST_EVENT_TICK = 15;

function checkCondition(condition: TriggerCondition, state: GameState): boolean {
  const { type, key, value } = condition;

  switch (type) {
    case 'resource_above': {
      const res = state.resources as unknown as Record<string, number>;
      const derived = state.derived as unknown as Record<string, number>;
      const actual = res[key] ?? derived[key] ?? 0;
      return actual > (value as number);
    }
    case 'resource_below': {
      const res = state.resources as unknown as Record<string, number>;
      const derived = state.derived as unknown as Record<string, number>;
      const actual = res[key] ?? derived[key] ?? 0;
      return actual < (value as number);
    }
    case 'has_upgrade':
      return state.upgradesOwned.includes(key);
    case 'has_persona':
      return state.selectedPersonaId === key;
    case 'has_tool':
      return state.selectedToolId === key;
    case 'idea_active':
      return state.activeIdeaIds.includes(key);
    case 'idea_stage': {
      const idea = state.ideas[key];
      return idea ? idea.stage === value : false;
    }
    default:
      return true;
  }
}

function isEligible(event: EventDefinition, state: GameState): boolean {
  // Already pending
  if (state.pendingEvent === event.id) return false;

  // Minimum run tick
  if (event.minRunTick && state.tickCount < event.minRunTick) return false;

  // Cooldown
  const lastFired = state.cooldowns[event.id] ?? -Infinity;
  if (state.tickCount - lastFired < event.cooldown) return false;

  // Trigger conditions (all must pass)
  if (event.triggerConditions) {
    for (const cond of event.triggerConditions) {
      if (!checkCondition(cond, state)) return false;
    }
  }

  return true;
}

export interface EventSchedule {
  eligibleCount: number;
  ticksUntilNextRoll: number;
  ticksUntilForce: number;
  nextRollAtTick: number;
  forceAtTick: number;
  isPending: boolean;
  isRolling: boolean;
}

export function getEligibleEventCount(state: GameState): number {
  if (state.pendingEvent !== null) return 0;
  return EVENTS.filter(event => isEligible(event, state)).length;
}

export function getEventSchedule(state: GameState): EventSchedule {
  const isFirstEvent = Object.keys(state.cooldowns).length === 0;
  const lastEventTick = isFirstEvent ? 0 : Math.max(...Object.values(state.cooldowns));
  const nextRollAtTick = isFirstEvent ? FIRST_EVENT_TICK : lastEventTick + MIN_EVENT_INTERVAL;
  const forceAtTick = isFirstEvent ? FIRST_EVENT_TICK : lastEventTick + MAX_EVENT_INTERVAL;

  return {
    eligibleCount: getEligibleEventCount(state),
    ticksUntilNextRoll: Math.max(0, nextRollAtTick - state.tickCount),
    ticksUntilForce: Math.max(0, forceAtTick - state.tickCount),
    nextRollAtTick,
    forceAtTick,
    isPending: state.pendingEvent !== null,
    isRolling: state.tickCount >= nextRollAtTick,
  };
}

// Returns the event ID to fire this tick, or null if no event should fire.
export function rollForEvent(state: GameState): string | null {
  // Don't fire if another event is already pending
  if (state.pendingEvent !== null) return null;

  const eligible = EVENTS.filter(e => isEligible(e, state));
  if (eligible.length === 0) return null;

  const schedule = getEventSchedule(state);
  if (state.tickCount < schedule.nextRollAtTick) return null;

  const shouldRoll = state.tickCount >= schedule.forceAtTick || Math.random() < (1 / MIN_EVENT_INTERVAL);
  if (!shouldRoll) return null;

  const rng = createRng(state.tickCount * 31337 + state.resources.cash);
  const weighted = eligible.map(e => ({ item: e, weight: e.weight }));
  const chosen = weightedPick(rng, weighted);

  return chosen ? chosen.id : null;
}
