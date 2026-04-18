import styles from './AsciiLogo.module.css';

const LOGO = [
  '██╗   ██╗██╗██████╗ ███████╗',
  '██║   ██║██║██╔══██╗██╔════╝',
  '██║   ██║██║██████╔╝█████╗  ',
  '╚██╗ ██╔╝██║██╔══██╗██╔══╝  ',
  ' ╚████╔╝ ██║██████╔╝███████╗',
  '',
  ' ██████╗ ██████╗ ██████╗ ███████╗',
  '██╔════╝██╔═══██╗██╔══██╗██╔════╝',
  '██║     ██║   ██║██║  ██║█████╗  ',
  '██║     ██║   ██║██║  ██║██╔══╝  ',
  '╚██████╗╚██████╔╝██████╔╝███████╗',
].join('\n');

export function AsciiLogo() {
  return (
    <div className={styles.wrap} role="img" aria-label="Vibe Code">
      <pre aria-hidden="true" className={styles.shadow}>{LOGO}</pre>
      <pre className={styles.front}>{LOGO}</pre>
    </div>
  );
}
