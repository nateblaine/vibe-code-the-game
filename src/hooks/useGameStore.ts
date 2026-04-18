import { create } from 'zustand';
import type { GameState, UIState, Screen, RunSetupStep } from '../types/state';
import { createInitialState, type RunConfig } from '../core/gameState';
import { tick, applyEventChoice, applyUpgradePurchase, adjustIdeaCapacity } from '../core/simulation';
import { loadGame, saveGame, hasSave, clearSave } from '../core/saveSystem';
import { EVENTS } from '../content/events';

interface GameStore {
  // Game state
  gameState: GameState | null;

  // UI state (not persisted)
  ui: UIState;

  // Actions
  startRun: (config: RunConfig) => void;
  continueRun: () => boolean;
  tick: () => void;
  resolveEvent: (choiceIndex: number) => void;
  buyUpgrade: (upgradeId: string) => void;
  adjustCapacity: (ideaId: string, delta: number) => void;
  saveNow: () => void;
  newGame: () => void;

  // UI actions
  setScreen: (screen: Screen) => void;
  setRunSetupStep: (step: RunSetupStep) => void;
  setRunSetupSelection: (key: keyof UIState['runSetupSelections'], value: string | string[]) => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
  setUpgradeCategory: (cat: string | null) => void;
  setTickRunning: (running: boolean) => void;
  togglePauseOnEvent: () => void;
  toggleAutoAccept: () => void;
  toggleTooltips: () => void;
}

const DEFAULT_UI: UIState = {
  screen: 'start',
  runSetupStep: 'persona',
  runSetupSelections: {
    personaId: null,
    toolId: null,
    skillIds: [],
    ideaId: null,
  },
  activeTab: 'ideas',
  upgradeCategory: null,
  isTickRunning: false,
};

function normalizeLoadedSettings(gameState: GameState): GameState {
  return {
    ...gameState,
    settings: {
      pauseOnEvent: gameState.settings.pauseOnEvent ?? true,
      autoAcceptEnabled: gameState.settings.autoAcceptEnabled ?? false,
      tooltipsEnabled: gameState.settings.tooltipsEnabled ?? true,
    },
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  ui: DEFAULT_UI,

  startRun: (config: RunConfig) => {
    const gameState = createInitialState(config);
    set({
      gameState,
      ui: { ...DEFAULT_UI, screen: 'game', isTickRunning: true },
    });
    saveGame(gameState);
  },

  continueRun: () => {
    const saved = loadGame();
    if (!saved) return false;
    const normalized = normalizeLoadedSettings(saved);
    const isEnded = !!normalized.meta.winCondition || !!normalized.meta.lossCondition;
    set({
      gameState: normalized,
      ui: { ...DEFAULT_UI, screen: isEnded ? 'end-run' : 'game', isTickRunning: !isEnded },
    });
    return true;
  },

  tick: () => {
    const { gameState, ui } = get();
    if (!gameState) return;

    // Don't tick if paused on event
    if (gameState.pendingEvent && gameState.settings.pauseOnEvent) return;

    const next = tick(gameState);

    // If game is won or lost, stop ticking
    if (next.meta.winCondition || next.meta.lossCondition) {
      set({ gameState: next, ui: { ...ui, isTickRunning: false, screen: 'end-run' } });
      saveGame(next);
      return;
    }

    set({ gameState: next });
  },

  resolveEvent: (choiceIndex: number) => {
    const { gameState } = get();
    if (!gameState?.pendingEvent) return;

    const eventId = gameState.pendingEvent;
    const eventDef = EVENTS.find(e => e.id === eventId);
    if (!eventDef) return;

    const choice = eventDef.choices[choiceIndex];
    if (!choice) return;

    const next = applyEventChoice(
      gameState,
      eventId,
      choiceIndex,
      choice.logMessage,
      choice.effects
    );

    set({ gameState: next });
  },

  buyUpgrade: (upgradeId: string) => {
    const { gameState } = get();
    if (!gameState) return;
    set({ gameState: applyUpgradePurchase(gameState, upgradeId) });
  },

  adjustCapacity: (ideaId: string, delta: number) => {
    const { gameState } = get();
    if (!gameState) return;
    set({ gameState: adjustIdeaCapacity(gameState, ideaId, delta) });
  },

  saveNow: () => {
    const { gameState } = get();
    if (gameState) saveGame(gameState);
  },

  newGame: () => {
    clearSave();
    set({ gameState: null, ui: { ...DEFAULT_UI, screen: 'start' } });
  },

  // UI actions
  setScreen: (screen) => set(s => ({ ui: { ...s.ui, screen } })),
  setRunSetupStep: (step) => set(s => ({ ui: { ...s.ui, runSetupStep: step } })),
  setRunSetupSelection: (key, value) =>
    set(s => ({
      ui: {
        ...s.ui,
        runSetupSelections: { ...s.ui.runSetupSelections, [key]: value },
      },
    })),
  setActiveTab: (tab) => set(s => ({ ui: { ...s.ui, activeTab: tab } })),
  setUpgradeCategory: (cat) => set(s => ({ ui: { ...s.ui, upgradeCategory: cat } })),
  setTickRunning: (running) => set(s => ({ ui: { ...s.ui, isTickRunning: running } })),
  togglePauseOnEvent: () =>
    set(s => ({
      gameState: s.gameState
        ? { ...s.gameState, settings: { ...s.gameState.settings, pauseOnEvent: !s.gameState.settings.pauseOnEvent } }
        : null,
    })),
  toggleAutoAccept: () =>
    set(s => ({
      gameState: s.gameState
        ? { ...s.gameState, settings: { ...s.gameState.settings, autoAcceptEnabled: !s.gameState.settings.autoAcceptEnabled } }
        : null,
    })),
  toggleTooltips: () =>
    set(s => ({
      gameState: s.gameState
        ? { ...s.gameState, settings: { ...s.gameState.settings, tooltipsEnabled: !s.gameState.settings.tooltipsEnabled } }
        : null,
    })),
}));

export function selectHasSave(): boolean {
  return hasSave();
}
