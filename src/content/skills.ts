import type { Skill } from '../types/content';

export const SKILLS: Skill[] = [
  {
    id: 'prompt-carpentry',
    name: 'Prompt Carpentry',
    description: 'You write prompts the way a careful person writes code: commented, tested, and never using "just do it."',
    effects: [
      { type: 'multiplier', stat: 'qualityMultiplier', value: 0.08 },
    ],
    unlocksTags: ['prompting'],
  },
  {
    id: 'hook-tinkering',
    name: 'Hook Tinkering',
    description: 'You know where the hooks live and you are not afraid to abuse them. Pre-commit, post-save, mid-existential-crisis.',
    effects: [
      { type: 'multiplier', stat: 'automationLevel', value: 0.10 },
    ],
    unlocksTags: ['automation', 'hooks'],
  },
  {
    id: 'context-packing',
    name: 'Context Packing',
    description: 'You can fit an entire product spec into a context window without the model noticing the compression.',
    effects: [
      { type: 'multiplier', stat: 'computeEfficiency', value: 0.10 },
    ],
    unlocksTags: ['compute'],
  },
  {
    id: 'bug-triaging',
    name: 'Bug Triaging',
    description: 'You can identify the one failing test that matters out of forty green ones. Instinctual at this point.',
    effects: [
      { type: 'multiplier', stat: 'outageSeverity', value: -0.12 },
    ],
    unlocksTags: ['stability'],
  },
  {
    id: 'hype-posting',
    name: 'Hype Posting',
    description: 'You write launch posts that make a CRUD app feel inevitable. No shame. High conversion.',
    effects: [
      { type: 'multiplier', stat: 'reputationGain', value: 0.15 },
    ],
    unlocksTags: ['growth', 'hype'],
  },
  {
    id: 'refactor-discipline',
    name: 'Refactor Discipline',
    description: 'You do not merge without reviewing the diff. You do not deploy without sleeping on it. You are alone at parties.',
    effects: [
      { type: 'multiplier', stat: 'debtGainRate', value: -0.15 },
    ],
    unlocksTags: ['stability', 'quality'],
  },
  {
    id: 'template-hoarding',
    name: 'Template Hoarding',
    description: 'You have a template for everything. Some of them even work.',
    effects: [
      { type: 'multiplier', stat: 'upgradeDiscount', value: 0.10 },
    ],
    unlocksTags: ['automation', 'tooling'],
  },
  {
    id: 'agent-wrangler',
    name: 'Agent Wrangler',
    description: 'You have a gift for keeping sub-agents on task. They still go rogue occasionally. You have gotten faster at reverting.',
    effects: [
      { type: 'flat', stat: 'agentCapacity', value: 1 },
    ],
    unlocksTags: ['agents', 'team'],
  },
];
