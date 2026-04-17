import React from 'react';
import styles from './Panel.module.css';

interface PanelProps {
  children: React.ReactNode;
  title?: string;
  raised?: boolean;
  scrollable?: boolean;
  className?: string;
}

export function Panel({ children, title, raised = false, scrollable = false, className = '' }: PanelProps) {
  return (
    <div className={[styles.panel, raised ? styles.raised : '', scrollable ? styles.scrollable : '', className].join(' ')}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={[styles.body, scrollable ? 'scroll-body' : ''].join(' ')}>
        {children}
      </div>
    </div>
  );
}
