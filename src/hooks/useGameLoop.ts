import { useEffect, useRef } from 'react';
import { useGameStore } from './useGameStore';

const TICK_INTERVAL_MS = 1000;

export function useGameLoop() {
  const tick = useGameStore(s => s.tick);
  const isRunning = useGameStore(s => s.ui.isTickRunning);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, TICK_INTERVAL_MS);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tick]);
}
