import { useRef } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import styles from './LogPanel.module.css';

const LOG_TYPE_COLOR: Record<string, string> = {
  info: 'var(--color-text-dim)',
  event: 'var(--color-yellow)',
  upgrade: 'var(--color-accent)',
  milestone: 'var(--color-green)',
  warning: 'var(--color-red)',
};

const LOG_TYPE_PREFIX: Record<string, string> = {
  info: '  ',
  event: '! ',
  upgrade: '↑ ',
  milestone: '★ ',
  warning: '⚠ ',
};

export function LogPanel() {
  const log = useGameStore(s => s.gameState?.log ?? []);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Keep scrolled to top (newest entries at top)
  // Log is newest-first so no auto-scroll needed

  return (
    <div className={styles.panel}>
      <div className={styles.header}>LOG</div>
      <div className={styles.entries}>
        {log.map((entry, i) => (
          <div key={i} className={styles.entry} style={{ color: LOG_TYPE_COLOR[entry.type] ?? 'var(--color-text-dim)' }}>
            <span className={styles.prefix}>{LOG_TYPE_PREFIX[entry.type] ?? '  '}</span>
            <span>{entry.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
