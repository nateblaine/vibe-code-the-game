import type { GameState } from '../types/state';
import type { EventDefinition, TriggerCondition } from '../types/content';
import { EVENTS } from '../content/events';
import { createRng, weightedPick } from './rng';

// Minimum ticks between any player-facing events (30 seconds at 1 tick/sec)
const MIN_EVENT_INTERVAL = 30;
// Maximum interval before an event is forced (90 seconds)
const MAX_EVENT_INTERVAL = 90;

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

// Returns the event ID to fire this tick, or null if no event should fire.
export function rollForEvent(state: GameState): string | null {
  // Don't fire if another event is already pending
  if (state.pendingEvent !== null) return null;

  // Determine if this tick should surface an event at all.
  // Use a probability curve: low probability per tick, tuned so events land every 30-90s.
  // At 1 tick/sec, 1/60 = ~1 event/minute on average (with spread).
  const ticksSinceLast = state.tickCount - Math.max(...Object.values(state.cooldowns), -Infinity);
  const isFirstEvent = Object.keys(state.cooldowns).length === 0;

  // After 90 ticks with no event, force one
  const forceEvent = isFirstEvent
    ? state.tickCount >= 15 // first event happens quickly (at ~15 ticks)
    : ticksSinceLast >= MAX_EVENT_INTERVAL;

  // Otherwise random chance
  const shouldRoll = forceEvent || Math.random() < (1 / MIN_EVENT_INTERVAL);
  if (!shouldRoll) return null;

  const eligible = EVENTS.filter(e => isEligible(e, state));
  if (eligible.length === 0) return null;

  const rng = createRng(state.tickCount * 31337 + state.resources.cash);
  const weighted = eligible.map(e => ({ item: e, weight: e.weight }));
  const chosen = weightedPick(rng, weighted);

  return chosen ? chosen.id : null;
}
