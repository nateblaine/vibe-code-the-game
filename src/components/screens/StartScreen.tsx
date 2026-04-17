import { useState, useEffect } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { hasSave } from '../../core/saveSystem';
import { Button } from '../ui/Button';
import styles from './StartScreen.module.css';

export function StartScreen() {
  const setScreen = useGameStore(s => s.setScreen);
  const continueRun = useGameStore(s => s.continueRun);
  const newGame = useGameStore(s => s.newGame);
  const [saveExists, setSaveExists] = useState(false);

  useEffect(() => {
    setSaveExists(hasSave());
  }, []);

  function handleContinue() {
    const loaded = continueRun();
    if (!loaded) setSaveExists(false);
  }

  function handleNewRun() {
    newGame();
    setScreen('run-setup');
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleBlock}>
        <div className={styles.title}>VIBE CODE</div>
        <div className={styles.subtitle}>THE VIDEO GAME</div>
        <div className={styles.tagline}>build the stack. ship the thing. reach $1,000,000.</div>
      </div>

      <div className={styles.actions}>
        {saveExists && (
          <Button variant="primary" onClick={handleContinue} fullWidth>
            Continue Run
          </Button>
        )}
        <Button variant={saveExists ? 'secondary' : 'primary'} onClick={handleNewRun} fullWidth>
          New Run
        </Button>
      </div>

      <div className={styles.credits}>
        <span className="text-dim">v0.1 — early prototype</span>
      </div>
    </div>
  );
}
