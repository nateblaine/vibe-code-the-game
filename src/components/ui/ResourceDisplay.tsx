import { useRef, useEffect, useState } from 'react';
import styles from './ResourceDisplay.module.css';

interface ResourceDisplayProps {
  label: string;
  value: number;
  format?: 'currency' | 'number' | 'percent' | 'rate';
  color?: 'default' | 'green' | 'yellow' | 'red' | 'accent' | 'purple';
  warning?: boolean;
}

function formatValue(value: number, format: ResourceDisplayProps['format']): string {
  switch (format) {
    case 'currency':
      if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
      if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
      return `$${value.toFixed(0)}`;
    case 'percent':
      return `${Math.floor(value)}%`;
    case 'rate':
      return `${value >= 0 ? '+' : ''}${value.toFixed(1)}/s`;
    default:
      return Math.floor(value).toString();
  }
}

export function ResourceDisplay({ label, value, format = 'number', color = 'default', warning = false }: ResourceDisplayProps) {
  const prevValueRef = useRef(value);
  const [flashClass, setFlashClass] = useState('');

  useEffect(() => {
    const prev = prevValueRef.current;
    if (prev !== value) {
      setFlashClass(value > prev ? styles.flashUp : styles.flashDown);
      const timer = setTimeout(() => setFlashClass(''), 600);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  const colorClass = warning ? styles.warning : styles[color] || '';

  return (
    <div className={styles.resource}>
      <span className={styles.label}>{label}</span>
      <span className={[styles.value, colorClass, flashClass].join(' ')}>
        {formatValue(value, format)}
      </span>
    </div>
  );
}
