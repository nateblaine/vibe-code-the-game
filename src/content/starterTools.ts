import type { StarterTool } from '../types/content';

export const STARTER_TOOLS: StarterTool[] = [
  {
    id: 'clyde-code',
    name: 'Clyde Code',
    tagline: 'Reliable. Slightly boring. Never hallucinates your schema.',
    description: 'The balanced generalist. Does what it says, says what it does. Slightly slower than the alternatives, significantly less haunted.',
    effects: [
      { type: 'multiplier', stat: 'ideaProgress', value: 0.05 },
      { type: 'multiplier', stat: 'debtGainRate', value: -0.05 },
    ],
  },
  {
    id: 'codey',
    name: 'Codey',
    tagline: 'Fast. Confident. Deeply incorrect on alternate Tuesdays.',
    description: 'Blazing throughput, chaotic outputs. Codey will ship your feature and also rename three variables to "thing" for reasons it cannot explain.',
    effects: [
      { type: 'multiplier', stat: 'ideaProgress', value: 0.10 },
      { type: 'multiplier', stat: 'focusInstability', value: 0.10 },
    ],
  },
  {
    id: 'gmoney',
    name: 'Gmoney',
    tagline: 'Premium throughput. Premium price. Premium anxiety.',
    description: 'The expensive one. Output quality is genuinely excellent. Your token bill will make you reconsider every architectural decision at 2am.',
    effects: [
      { type: 'multiplier', stat: 'qualityMultiplier', value: 0.15 },
      { type: 'multiplier', stat: 'burnRate', value: 0.15 },
    ],
  },
  {
    id: 'terminal-rat',
    name: 'Terminal Rat',
    tagline: 'Self-hosted. Offline. Unexpectedly powerful.',
    description: 'You run the model locally. No API costs. No rate limits. No one can explain what it is doing with 87% of your RAM.',
    effects: [
      { type: 'multiplier', stat: 'burnRate', value: -0.15 },
      { type: 'multiplier', stat: 'ideaProgress', value: -0.10 },
    ],
  },
];
