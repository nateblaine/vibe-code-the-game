import { IDEAS } from '../../content/ideas';
import { calcIncomePerTickFromMrr, calcWinScore, WIN_THRESHOLD } from '../../core/formulas';
import { useGameStore } from '../../hooks/useGameStore';
import { Button } from '../ui/Button';
import styles from './EndRunScreen.module.css';

function formatDuration(ticks: number): string {
  const minutes = Math.floor(ticks / 60);
  const seconds = ticks % 60;
  return `${minutes}m ${seconds}s`;
}

export function EndRunScreen() {
  const gameState = useGameStore(state => state.gameState);
  const newGame = useGameStore(state => state.newGame);
  const setScreen = useGameStore(state => state.setScreen);

  if (!gameState) return null;

  const outcomeTitle = gameState.meta.winCondition
    ? 'Run Won'
    : gameState.meta.lossCondition === 'burn'
      ? 'Cash Depleted'
      : gameState.meta.lossCondition === 'reputation'
        ? 'Reputation Collapsed'
        : 'Focus Depleted';

  const outcomeCopy = gameState.meta.winCondition
    ? 'You crossed the $1,000,000 threshold before the stack collapsed.'
    : gameState.meta.lossCondition === 'burn'
      ? 'The run ended because cash hit zero. Review burn versus income and try to get net positive earlier.'
      : 'The run ended before the company stabilized. You can inspect the final state or start over.';

  const primaryIdea = IDEAS.find(idea => idea.id === gameState.activeIdeaIds[0]);
  const finalIdea = primaryIdea ? gameState.ideas[primaryIdea.id] : null;
  const winScore = calcWinScore(gameState);
  const finalIdeaIncome = finalIdea ? calcIncomePerTickFromMrr(gameState, finalIdea.mrr) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.kicker}>{gameState.meta.winCondition ? 'SUCCESS' : 'RUN OVER'}</div>
        <div className={styles.title}>{outcomeTitle}</div>
        <p className={styles.copy}>{outcomeCopy}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.label}>Score</span>
            <span className={styles.value}>${winScore.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Target</span>
            <span className={styles.value}>${WIN_THRESHOLD.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Run Time</span>
            <span className={styles.value}>{formatDuration(gameState.tickCount)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Cash</span>
            <span className={styles.value}>${Math.round(gameState.resources.cash).toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Earned</span>
            <span className={styles.value}>${Math.round(gameState.meta.totalEarned).toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Events Seen</span>
            <span className={styles.value}>{gameState.eventHistory.length}</span>
          </div>
        </div>

        {primaryIdea && finalIdea && (
          <div className={styles.ideaSummary}>
            <div className={styles.ideaTitle}>Primary Idea</div>
            <div className={styles.ideaName}>{primaryIdea.name}</div>
            <div className={styles.ideaMeta}>
              Final stage: {finalIdea.stage.toUpperCase()} | Income: ${finalIdeaIncome.toFixed(2)}/tick | Debt: {gameState.resources.technicalDebt.toFixed(0)}%
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => setScreen('game')}>
            Review Run
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              newGame();
              setScreen('run-setup');
            }}
          >
            New Run
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              newGame();
              setScreen('start');
            }}
          >
            Return to Title
          </Button>
        </div>
      </div>
    </div>
  );
}
