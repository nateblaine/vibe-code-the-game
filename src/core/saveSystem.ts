import type { GameState } from '../types/state';

const SAVE_KEY = 'vibeCode_save';
const SAVE_VERSION = 1;

interface SaveData {
  version: number;
  savedAt: number;
  state: GameState;
}

export function saveGame(state: GameState): void {
  const data: SaveData = {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    state,
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // localStorage can throw if storage is full; silently fail
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data: SaveData = JSON.parse(raw);
    if (data.version !== SAVE_VERSION) {
      // Version mismatch — discard save to avoid corrupt state
      clearSave();
      return null;
    }
    return data.state;
  } catch {
    return null;
  }
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
