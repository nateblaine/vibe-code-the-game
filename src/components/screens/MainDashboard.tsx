import { useGameStore } from '../../hooks/useGameStore';
import { TopBar } from '../ui/TopBar';
import { IdeaCard } from '../ui/IdeaCard';
import { UpgradePanel } from '../ui/UpgradePanel';
import { LogPanel } from '../ui/LogPanel';
import { EventModal } from '../ui/EventModal';
import { StatReferencePanel } from '../ui/StatReferencePanel';
import styles from './MainDashboard.module.css';

export function MainDashboard() {
  const gameState = useGameStore(s => s.gameState);
  const saveNow = useGameStore(s => s.saveNow);
  const newGame = useGameStore(s => s.newGame);
  const togglePauseOnEvent = useGameStore(s => s.togglePauseOnEvent);
  const toggleAutoAccept = useGameStore(s => s.toggleAutoAccept);
  const toggleTooltips = useGameStore(s => s.toggleTooltips);
  const activeTab = useGameStore(s => s.ui.activeTab);
  const setActiveTab = useGameStore(s => s.setActiveTab);
  const isTickRunning = useGameStore(s => s.ui.isTickRunning);
  const setTickRunning = useGameStore(s => s.setTickRunning);

  if (!gameState) return null;

  const { activeIdeaIds, derived, settings } = gameState;
  const autoAcceptUnlocked = gameState.upgradesOwned.includes('auto-triage-queue');
  const hasPendingEvent = gameState.pendingEvent !== null;

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
            <button
              className={[styles.tab, activeTab === 'guide' ? styles.activeTab : ''].join(' ')}
              onClick={() => setActiveTab('guide')}
            >
              GUIDE
            </button>
            <div className={styles.tabMeta}>
              <span className={styles.capacityIndicator} title="Agent Capacity">
                Agents: {activeIdeaIds.reduce((s, id) => s + (gameState.ideas[id]?.assignedCapacity ?? 0), 0)}/{derived.agentCapacity}
              </span>
              {hasPendingEvent && <span className={styles.eventStatus}>Event waiting</span>}
              <button
                className={[styles.runControl, isTickRunning ? styles.runControlPause : styles.runControlPlay].join(' ')}
                onClick={() => setTickRunning(!isTickRunning)}
              >
                {isTickRunning ? 'Pause' : 'Resume'}
              </button>
            </div>
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

            {activeTab === 'guide' && (
              <div className={styles.guideTab}>
                <StatReferencePanel title="Quick Reference" />
              </div>
            )}

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

                {autoAcceptUnlocked && (
                  <div className={styles.settingRow}>
                    <div>
                      <div className={styles.settingLabel}>Auto-triage</div>
                      <div className={styles.settingDesc}>Resolve new events automatically using the triage heuristic</div>
                    </div>
                    <button
                      className={[styles.toggle, settings.autoAcceptEnabled ? styles.toggleOn : ''].join(' ')}
                      onClick={toggleAutoAccept}
                    >
                      {settings.autoAcceptEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                )}

                <div className={styles.settingRow}>
                  <div>
                    <div className={styles.settingLabel}>Tooltips</div>
                    <div className={styles.settingDesc}>Show hover definitions for glossary terms and stat labels</div>
                  </div>
                  <button
                    className={[styles.toggle, settings.tooltipsEnabled ? styles.toggleOn : ''].join(' ')}
                    onClick={toggleTooltips}
                  >
                    {settings.tooltipsEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

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

      <EventModal />
    </div>
  );
}
