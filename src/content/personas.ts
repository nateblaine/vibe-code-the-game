import type { Persona } from '../types/content';

export const PERSONAS: Persona[] = [
  {
    id: 'big-tech-lead',
    name: 'Ex-Big-Tech Lead',
    tagline: 'You survived the reorg. Now you run it.',
    description: 'Five years of platform work and three IPOs taught you that systems outlive hype. You move slower but break less.',
    bonuses: [
      { type: 'multiplier', stat: 'focus', value: 0.10 },
      { type: 'multiplier', stat: 'debtGainRate', value: -0.10 },
    ],
    weaknesses: [
      { type: 'multiplier', stat: 'hypeMultiplier', value: -0.15 },
    ],
    startingPassive: 'Process Memory — first upgrade purchase costs 15% less',
  },
  {
    id: 'indie-hacker-goblin',
    name: 'Indie Hacker Goblin',
    tagline: 'Ship. Tweet. Repeat. Die.',
    description: 'You have launched eleven products, three of which were the same product. You move fast, break things, and occasionally make money.',
    bonuses: [
      { type: 'multiplier', stat: 'ideaProgress', value: 0.15 },
      { type: 'multiplier', stat: 'eventUpside', value: 0.10 },
    ],
    weaknesses: [
      { type: 'multiplier', stat: 'focusInstability', value: 0.10 },
    ],
    startingPassive: 'Shipping Muscle — prototype stage completes 20% faster',
  },
  {
    id: 'open-source-hero',
    name: 'Open-Source Cult Hero',
    tagline: 'GitHub stars do not pay the token bill.',
    description: 'You have 4,200 GitHub stars on a YAML formatter. The community loves you. Your bank account is aggressively normal.',
    bonuses: [
      { type: 'multiplier', stat: 'reputationGain', value: 0.15 },
      { type: 'multiplier', stat: 'upgradeDiscount', value: 0.10 },
    ],
    weaknesses: [
      { type: 'multiplier', stat: 'directMonetization', value: -0.15 },
    ],
    startingPassive: 'Community Leverage — reputation-based events trigger more often',
  },
  {
    id: 'enterprise-wizard',
    name: 'Enterprise Workflow Wizard',
    tagline: 'I turned a spreadsheet into a $40k contract.',
    description: 'You speak fluent procurement. You have a deck for every occasion and a case study for every objection.',
    bonuses: [
      { type: 'multiplier', stat: 'directMonetization', value: 0.20 },
      { type: 'multiplier', stat: 'burnRate', value: -0.10 },
    ],
    weaknesses: [
      { type: 'multiplier', stat: 'hypeMultiplier', value: -0.20 },
    ],
    startingPassive: 'Annual Contract Instinct — first B2B idea earns 25% more MRR',
  },
];
