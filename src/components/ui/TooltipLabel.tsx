import type { ReactNode } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import styles from './TooltipLabel.module.css';

interface TooltipLabelProps {
  children: ReactNode;
  tooltip?: string;
  className?: string;
}

export function TooltipLabel({ children, tooltip, className = '' }: TooltipLabelProps) {
  const tooltipsEnabled = useGameStore(state => state.gameState?.settings.tooltipsEnabled ?? true);

  if (!tooltip || !tooltipsEnabled) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={[styles.wrap, className].join(' ')}>
      <span className={styles.trigger}>{children}</span>
      <span className={styles.tooltip}>{tooltip}</span>
    </span>
  );
}
