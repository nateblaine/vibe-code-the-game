import { EVENTS } from '../../content/events';
import { useGameStore } from '../../hooks/useGameStore';
import { Button } from './Button';
import styles from './EventModal.module.css';

function formatEffect(type: 'flat' | 'multiplier', stat: string, value: number): string {
  const label = stat.replace(/([A-Z])/g, ' $1').toLowerCase();
  const sign = value >= 0 ? '+' : '';

  if (type === 'multiplier') {
    return `${sign}${(value * 100).toFixed(0)}% ${label}`;
  }

  return `${sign}${Number.isInteger(value) ? value : value.toFixed(2)} ${label}`;
}

export function EventModal() {
  const gameState = useGameStore(state => state.gameState);
  const resolveEvent = useGameStore(state => state.resolveEvent);

  if (!gameState?.pendingEvent) return null;

  const event = EVENTS.find(candidate => candidate.id === gameState.pendingEvent);
  if (!event) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.kicker}>{event.category.toUpperCase()}</span>
          <div className={styles.title}>{event.title}</div>
        </div>

        <p className={styles.description}>{event.description}</p>

        <div className={styles.choices}>
          {event.choices.map((choice, index) => (
            <button key={choice.label} className={styles.choice} onClick={() => resolveEvent(index)}>
              <div className={styles.choiceLabel}>{choice.label}</div>
              <div className={styles.choiceDescription}>{choice.description}</div>
              <div className={styles.effectList}>
                {choice.effects.map(effect => (
                  <span
                    key={`${choice.label}-${effect.stat}-${effect.value}`}
                    className={[styles.effect, effect.value >= 0 ? styles.effectGood : styles.effectBad].join(' ')}
                  >
                    {formatEffect(effect.type, effect.stat, effect.value)}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerCopy}>
            {gameState.settings.pauseOnEvent ? 'Simulation paused until you choose.' : 'Simulation continues while this is open.'}
          </span>
          <Button variant="ghost" onClick={() => resolveEvent(0)}>
            Quick Pick
          </Button>
        </div>
      </div>
    </div>
  );
}
