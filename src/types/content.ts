// Static content definition types — authored in content/ and never mutated at runtime.

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  description: string;
  bonuses: StatModifier[];
  weaknesses: StatModifier[];
  startingPassive?: string; // flavor label only for now
}

export interface StarterTool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  effects: StatModifier[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  effects: StatModifier[];
  unlocksTags?: string[]; // tags on upgrades this skill unlocks early
}

export type IdeaStage = 'concept' | 'prototype' | 'launch' | 'growth' | 'scale' | 'plateau';

export interface IdeaDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  incomeModel: 'saas' | 'marketplace' | 'oneoff' | 'ads' | 'consulting';
  complexity: 1 | 2 | 3; // 1=low, 2=medium, 3=high
  hypeProfile: 'low' | 'medium' | 'high' | 'viral';
  maintenanceLoad: 1 | 2 | 3;
  computePerCapacity: number; // compute consumed per assigned capacity unit per tick
  progressPerCapacity: number; // progress points per assigned capacity unit per tick
  stageThresholds: [number, number, number, number, number]; // progress needed for [prototype, launch, growth, scale, plateau]
  mrrAtLaunch: number; // starting MRR when idea hits launch stage
  mrrGrowthPerTick: number; // MRR growth rate per tick in growth stage
  debtGainRate: number; // tech debt generated per tick when this idea is active
  tags: string[];
}

export type UpgradeCategory = 'tooling' | 'automation' | 'team' | 'product' | 'stability' | 'growth' | 'infra';

export interface UpgradeDefinition {
  id: string;
  name: string;
  category: UpgradeCategory;
  description: string;
  flavorText: string;
  cost: number;
  effects: StatModifier[];
  requires?: string[]; // upgrade IDs that must be owned first
  requiresTags?: string[]; // skill tags needed for early unlock
  oneTime: boolean; // can only be bought once
  tags: string[];
}

export type EventCategory =
  | 'tooling'
  | 'product'
  | 'team'
  | 'infra'
  | 'reputation'
  | 'legal'
  | 'personal'
  | 'easter-egg';

export interface EventDefinition {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  weight: number;
  cooldown: number; // minimum ticks before this event can fire again
  minRunTick?: number; // don't fire before this tick
  triggerConditions?: TriggerCondition[];
  choices: EventChoice[];
  tags: string[];
}

export interface EventChoice {
  label: string;
  description: string;
  effects: StatModifier[];
  logMessage: string;
}

export interface TriggerCondition {
  type: 'resource_above' | 'resource_below' | 'has_upgrade' | 'has_persona' | 'has_tool' | 'idea_stage' | 'idea_active';
  key: string;
  value?: number | string;
}

// A modifier applied to a resource or derived stat.
// positive multiplier = boost, negative = penalty, flat = direct add/subtract
export interface StatModifier {
  type: 'flat' | 'multiplier';
  stat: ModifiableStat;
  value: number;
}

export type ModifiableStat =
  | 'cash'
  | 'compute'
  | 'focus'
  | 'reputation'
  | 'technicalDebt'
  | 'burnRate'
  | 'agentCapacity'
  | 'automationLevel'
  | 'stability'
  | 'hypeMultiplier'
  | 'computeEfficiency'
  | 'qualityMultiplier'
  | 'debtGainRate'
  | 'outageSeverity'
  | 'eventUpside'
  | 'focusInstability'
  | 'reputationGain'
  | 'directMonetization'
  | 'ideaProgress'
  | 'upgradeDiscount';
