import type { GameState, IdeaProgressState } from '../types/state';
import { IDEAS } from '../content/ideas';
import { calcDerived } from './formulas';

export interface RunConfig {
  personaId: string;
  toolId: string;
  skillIds: string[];
  ideaId: string;
}

function createIdeaState(ideaId: string): IdeaProgressState {
  return {
    ideaId,
    stage: 'concept',
    progress: 0,
    assignedCapacity: 0,
    quality: 1.0,
    activeUsers: 0,
    mrr: 0,
    churnRisk: 0,
    maintenanceLoad: 0,
    hiddenFlags: [],
  };
}

export function createInitialState(config: RunConfig): GameState {
  const ideaDef = IDEAS.find(i => i.id === config.ideaId);
  if (!ideaDef) throw new Error(`Unknown idea: ${config.ideaId}`);

  const now = Date.now();
  const runId = `run-${now}-${Math.random().toString(36).slice(2, 8)}`;

  const partial: GameState = {
    runId,
    startedAt: now,
    lastTickAt: now,
    tickCount: 0,

    resources: {
      cash: 500,
      compute: 50,
      focus: 60,
      reputation: 10,
      technicalDebt: 5,
    },

    derived: {
      burnRate: 0,
      agentCapacity: 3,
      automationLevel: 0,
      stability: 1,
      hypeMultiplier: 1,
      incomePerTick: 0,
      netPerTick: 0,
    },

    selectedPersonaId: config.personaId,
    selectedToolId: config.toolId,
    selectedSkillIds: config.skillIds,

    activeIdeaIds: [config.ideaId],
    ideas: {
      [config.ideaId]: createIdeaState(config.ideaId),
    },
    upgradesOwned: [],

    temporaryModifiers: [],
    cooldowns: {},
    eventHistory: [],
    pendingEvent: null,
    log: [
      {
        tick: 0,
        message: `Run started. Idea: ${ideaDef.name}. Tool: ${config.toolId}. Stack assembled.`,
        type: 'milestone',
      },
    ],

    meta: {
      totalEarned: 0,
      valuationBonus: 0,
      winCondition: null,
      lossCondition: null,
      burnWarningTicks: 0,
    },

    settings: {
      pauseOnEvent: true,
      autoAcceptEnabled: false,
      tooltipsEnabled: true,
    },
  };

  // Calculate initial derived stats
  partial.derived = calcDerived(partial);
  return partial;
}
