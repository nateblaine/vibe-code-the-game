import { useGameStore } from '../../hooks/useGameStore';
import { ResourceDisplay } from './ResourceDisplay';
import { calcWinScore, WIN_THRESHOLD } from '../../core/formulas';
import styles from './TopBar.module.css';

export function TopBar() {
  const gameState = useGameStore(s => s.gameState);
  if (!gameState) return null;

  const { resources, derived } = gameState;
  const winProgress = Math.min(100, (calcWinScore(gameState) / WIN_THRESHOLD) * 100);
  const burnWarning = gameState.meta.burnWarningTicks > 10;

  return (
    <div className={styles.topBar}>
      <div className={styles.resources}>
        <ResourceDisplay label="Cash" value={resources.cash} format="currency" color="green" />
        <ResourceDisplay label="Compute" value={resources.compute} format="number" color="accent" />
        <ResourceDisplay label="Focus" value={resources.focus} format="percent" color={resources.focus < 20 ? 'red' : 'default'} />
        <ResourceDisplay label="Reputation" value={resources.reputation} format="number" color="purple" />
        <ResourceDisplay label="Tech Debt" value={resources.technicalDebt} format="percent" color={resources.technicalDebt > 60 ? 'red' : resources.technicalDebt > 30 ? 'yellow' : 'default'} />
        <ResourceDisplay label="Burn/s" value={derived.burnRate} format="rate" color="yellow" warning={burnWarning} />
        <ResourceDisplay label="Income/s" value={derived.incomePerTick} format="rate" color="green" />
      </div>

      <div className={styles.progress}>
        <span className={styles.progressLabel}>$1M Progress</span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${winProgress}%` }} />
        </div>
        <span className={styles.progressPct}>{winProgress.toFixed(1)}%</span>
      </div>
    </div>
  );
}
