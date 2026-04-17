// Re-exports and event-specific types used at runtime (distinct from static definitions in content.ts)

export type { EventDefinition, EventChoice, TriggerCondition, EventCategory } from './content';

export interface ResolvedEventOutcome {
  eventId: string;
  choiceIndex: number;
  tick: number;
  logMessage: string;
}
