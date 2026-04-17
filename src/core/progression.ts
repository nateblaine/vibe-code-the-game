import type { GameState } from '../types/state';
import type { IdeaStage } from '../types/content';
import { calcWinScore, WIN_THRESHOLD } from './formulas';

const STAGES: IdeaStage[] = ['concept', 'prototype', 'launch', 'growth', 'scale', 'plateau'];

// Advance an idea's stage if it has hit the threshold for the next stage.
// Returns the new stage if it changed, null otherwise.
export function checkIdeaStageAdvance(
  state: GameState,
  ideaId: string,
  stageThresholds: [number, number, number, number, number]
): IdeaStage | null {
  const idea = state.ideas[ideaId];
  if (!idea) return null;

  const currentStageIndex = STAGES.indexOf(idea.stage);
  if (currentStageIndex >= STAGES.length - 1) return null; // already at plateau

  // stageThresholds: [prototype, launch, growth, scale, plateau]
  // so threshold index = currentStageIndex (0=concept->prototype needs thresholds[0])
  const threshold = stageThresholds[currentStageIndex];
  if (threshold === undefined) return null;

  if (idea.progress >= threshold) {
    return STAGES[currentStageIndex + 1];
  }
  return null;
}

// Check if win condition is met
export function checkWin(state: GameState): boolean {
  return calcWinScore(state) >= WIN_THRESHOLD;
}

// Check for soft-loss conditions.
// Returns the condition type or null if game is fine.
export function checkSoftLoss(state: GameState): 'burn' | 'reputation' | 'focus' | null {
  if (state.meta.burnWarningTicks >= 60) return 'burn';
  if (state.resources.reputation <= -20) return 'reputation';
  if (state.resources.focus <= 0) return 'focus';
  return null;
}

// Returns IDs of upgrades now available for purchase (not owned, requirements met)
export function getAvailableUpgradeIds(state: GameState, allUpgradeIds: string[]): string[] {
  return allUpgradeIds.filter(id => {
    if (state.upgradesOwned.includes(id)) return false;
    return true; // requirement checks done at purchase time
  });
}
