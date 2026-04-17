import { useGameStore } from './hooks/useGameStore';
import { useGameLoop } from './hooks/useGameLoop';
import { StartScreen } from './components/screens/StartScreen';
import { RunSetupScreen } from './components/screens/RunSetupScreen';
import { MainDashboard } from './components/screens/MainDashboard';

export default function App() {
  const screen = useGameStore(s => s.ui.screen);

  // Activate the game loop (only runs when ui.isTickRunning is true)
  useGameLoop();

  if (screen === 'start') return <StartScreen />;
  if (screen === 'run-setup') return <RunSetupScreen />;
  if (screen === 'game') return <MainDashboard />;
  if (screen === 'end-run') return <div style={{ color: 'var(--color-yellow)', padding: '32px', fontSize: '10px' }}>End screen coming in Phase 7…</div>;

  return null;
}
