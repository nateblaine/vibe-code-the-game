import type { IdeaStage } from './content';

export type Screen = 'start' | 'run-setup' | 'game' | 'end-run';
export type RunSetupStep = 'persona' | 'tool' | 'skills' | 'idea' | 'confirm';
export type WinCondition = 'million' | null;
export type LossCondition = 'burn' | 'reputation' | 'focus' | null;

export interface GameState {
  runId: string;
  startedAt: number;
  lastTickAt: number;
  tickCount: number;

  resources: ResourceBlock;
  derived: DerivedBlock;

  selectedPersonaId: string;
  selectedToolId: string;
  selectedSkillIds: string[];

  activeIdeaIds: string[];
  ideas: Record<string, IdeaProgressState>;
  upgradesOwned: string[];

  temporaryModifiers: ModifierInstance[];
  cooldowns: Record<string, number>; // eventId -> last fired tick
  eventHistory: string[]; // event IDs in order fired
  pendingEvent: string | null; // ID of event currently shown in modal
  log: LogEntry[];

  meta: MetaBlock;

  // Settings (persisted with run)
  settings: SettingsBlock;
}

export interface ResourceBlock {
  cash: number;
  compute: number;
  focus: number;
  reputation: number;
  technicalDebt: number;
}

export interface DerivedBlock {
  burnRate: number;
  agentCapacity: number;
  automationLevel: number;
  stability: number;
  hypeMultiplier: number;
  // Computed each tick, not stored — kept here for UI display convenience
  incomePerTick: number;
  netPerTick: number;
}

export interface IdeaProgressState {
  ideaId: string;
  stage: IdeaStage;
  progress: number;
  assignedCapacity: number;
  quality: number;
  activeUsers: number;
  mrr: number;
  churnRisk: number;
  maintenanceLoad: number;
  hiddenFlags: string[];
}

export interface ModifierInstance {
  id: string;
  stat: string;
  type: 'flat' | 'multiplier';
  value: number;
  expiresAtTick: number | null; // null = permanent
  source: string; // upgrade ID, event ID, etc.
}

export interface LogEntry {
  tick: number;
  message: string;
  type: 'info' | 'event' | 'upgrade' | 'milestone' | 'warning';
}

export interface MetaBlock {
  totalEarned: number;
  valuationBonus: number;
  winCondition: WinCondition;
  lossCondition: LossCondition;
  burnWarningTicks: number; // consecutive ticks where burn > income
}

export interface SettingsBlock {
  pauseOnEvent: boolean;     // default true; pause tick while event modal is open
  autoAcceptEnabled: boolean; // unlocked by Auto-Triage Queue upgrade
}

// UI-only state (not persisted)
export interface UIState {
  screen: Screen;
  runSetupStep: RunSetupStep;
  runSetupSelections: {
    personaId: string | null;
    toolId: string | null;
    skillIds: string[];
    ideaId: string | null;
  };
  activeTab: 'ideas' | 'upgrades' | 'settings';
  upgradeCategory: string | null; // filter for upgrade panel
  isTickRunning: boolean;
}
