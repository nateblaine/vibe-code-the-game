import { useGameStore } from '../../hooks/useGameStore';
import { ResourceDisplay } from './ResourceDisplay';
import { calcWinScore, WIN_THRESHOLD } from '../../core/formulas';
import { getStatDescription } from '../../core/displayText';
import { getEventSchedule } from '../../core/eventEngine';
import { formatTickCountdown, getWorldClock } from '../../core/time';
import styles from './TopBar.module.css';

export function TopBar() {
  const gameState = useGameStore(s => s.gameState);
  if (!gameState) return null;

  const { resources, derived } = gameState;
  const winProgress = Math.min(100, (calcWinScore(gameState) / WIN_THRESHOLD) * 100);
  const burnWarning = gameState.meta.burnWarningTicks > 10;
  const worldClock = getWorldClock(gameState.tickCount);
  const eventSchedule = getEventSchedule(gameState);

  const eventStatus = (() => {
    if (gameState.pendingEvent) return 'Event waiting';
    if (eventSchedule.eligibleCount === 0) return 'No eligible events';
    if (!eventSchedule.isRolling) return `Window opens in ${formatTickCountdown(eventSchedule.ticksUntilNextRoll)}`;
    if (eventSchedule.ticksUntilForce === 0) return 'Forced event now';
    return `Random rolls live, forced in ${formatTickCountdown(eventSchedule.ticksUntilForce)}`;
  })();

  return (
    <div className={styles.topBar}>
      <div className={styles.resources}>
        <ResourceDisplay label="Cash" value={resources.cash} format="currency" color="green" tooltip={getStatDescription('cash')} />
        <ResourceDisplay label="Compute" value={resources.compute} format="number" color="accent" tooltip={getStatDescription('compute')} />
        <ResourceDisplay label="Focus" value={resources.focus} format="percent" color={resources.focus < 20 ? 'red' : 'default'} tooltip={getStatDescription('focus')} />
        <ResourceDisplay label="Reputation" value={resources.reputation} format="number" color="purple" tooltip={getStatDescription('reputation')} />
        <ResourceDisplay label="Tech Debt" value={resources.technicalDebt} format="percent" color={resources.technicalDebt > 60 ? 'red' : resources.technicalDebt > 30 ? 'yellow' : 'default'} tooltip={getStatDescription('technicalDebt')} />
        <ResourceDisplay label="Burn/tick" value={derived.burnRate} format="rate" color="yellow" warning={burnWarning} tooltip={getStatDescription('burnRate')} />
        <ResourceDisplay label="Income/tick" value={derived.incomePerTick} format="rate" color="green" tooltip={getStatDescription('incomePerTick')} />
      </div>

      <div className={styles.statusRail}>
        <div className={styles.clockCard}>
          <span className={styles.cardLabel}>Run Clock</span>
          <span className={styles.clockValue}>Day {worldClock.day} • {worldClock.label}</span>
        </div>

        <div className={styles.eventCard}>
          <span className={styles.cardLabel}>Event Loop</span>
          <span className={styles.eventValue}>{eventStatus}</span>
        </div>

        <div className={styles.progress}>
          <span className={styles.progressLabel}>$1M Progress</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${winProgress}%` }} />
          </div>
          <span className={styles.progressPct}>{winProgress.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
