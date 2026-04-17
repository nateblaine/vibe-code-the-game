import { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { TopBar } from '../ui/TopBar';
import { IdeaCard } from '../ui/IdeaCard';
import { UpgradePanel } from '../ui/UpgradePanel';
import { LogPanel } from '../ui/LogPanel';
import styles from './MainDashboard.module.css';

type Tab = 'ideas' | 'upgrades' | 'settings';

export function MainDashboard() {
  const gameState = useGameStore(s => s.gameState);
  const saveNow = useGameStore(s => s.saveNow);
  const newGame = useGameStore(s => s.newGame);
  const togglePauseOnEvent = useGameStore(s => s.togglePauseOnEvent);
  const [activeTab, setActiveTab] = useState<Tab>('ideas');

  if (!gameState) return null;

  const { activeIdeaIds, derived, settings } = gameState;

  return (
    <div className={styles.layout}>
      <TopBar />

      <div className={styles.body}>
        {/* Left panel: tabs */}
        <div className={styles.main}>
          <div className={styles.tabs}>
            <button
              className={[styles.tab, activeTab === 'ideas' ? styles.activeTab : ''].join(' ')}
              onClick={() => setActiveTab('ideas')}
            >
              IDEAS
            </button>
            <button
              className={[styles.tab, activeTab === 'upgrades' ? styles.activeTab : ''].join(' ')}
              onClick={() => setActiveTab('upgrades')}
            >
              UPGRADES
            </button>
            <button
              className={[styles.tab, activeTab === 'settings' ? styles.activeTab : ''].join(' ')}
              onClick={() => setActiveTab('settings')}
            >
              SETTINGS
            </button>
            <span className={styles.capacityIndicator} title="Agent Capacity">
              Agents: {activeIdeaIds.reduce((s, id) => s + (gameState.ideas[id]?.assignedCapacity ?? 0), 0)}/{derived.agentCapacity}
            </span>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'ideas' && (
              <div className={styles.ideasGrid}>
                {activeIdeaIds.map(id => (
                  <IdeaCard key={id} ideaId={id} />
                ))}
              </div>
            )}

            {activeTab === 'upgrades' && <UpgradePanel />}

            {activeTab === 'settings' && (
              <div className={styles.settings}>
                <div className={styles.settingRow}>
                  <div>
                    <div className={styles.settingLabel}>Pause on event</div>
                    <div className={styles.settingDesc}>Pause simulation while event modal is open</div>
                  </div>
                  <button
                    className={[styles.toggle, settings.pauseOnEvent ? styles.toggleOn : ''].join(' ')}
                    onClick={togglePauseOnEvent}
                  >
                    {settings.pauseOnEvent ? 'ON' : 'OFF'}
                  </button>
                </div>

                {settings.autoAcceptEnabled && (
                  <div className={styles.settingRow}>
                    <div>
                      <div className={styles.settingLabel}>Auto-accept events</div>
                      <div className={styles.settingDesc}>Auto-Triage Queue resolves low-stakes events automatically</div>
                    </div>
                    <span className="text-green" style={{ fontSize: '8px' }}>ACTIVE</span>
                  </div>
                )}

                <div className={styles.settingRow}>
                  <div>
                    <div className={styles.settingLabel}>Manual save</div>
                    <div className={styles.settingDesc}>Auto-saves every 30 ticks; use this to force save now</div>
                  </div>
                  <button className={styles.actionBtn} onClick={saveNow}>Save</button>
                </div>

                <div className={styles.settingRow}>
                  <div>
                    <div className={styles.settingLabel}>Abandon run</div>
                    <div className={styles.settingDesc}>Clears save and returns to start screen</div>
                  </div>
                  <button className={[styles.actionBtn, styles.danger].join(' ')} onClick={newGame}>
                    Abandon
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right rail: log */}
        <div className={styles.rightRail}>
          <LogPanel />
        </div>
      </div>
    </div>
  );
}
