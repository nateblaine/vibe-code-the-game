import React from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  className = '',
}: ButtonProps) {
  return (
    <button
      className={[styles.btn, styles[variant], fullWidth ? styles.fullWidth : '', className].join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
