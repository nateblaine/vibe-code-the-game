import { useGameStore } from '../../hooks/useGameStore';
import { PERSONAS } from '../../content/personas';
import { STARTER_TOOLS } from '../../content/starterTools';
import { SKILLS } from '../../content/skills';
import { IDEAS } from '../../content/ideas';
import { Button } from '../ui/Button';
import type { RunSetupStep } from '../../types/state';
import styles from './RunSetupScreen.module.css';

const STEPS: RunSetupStep[] = ['persona', 'tool', 'skills', 'idea', 'confirm'];
const STEP_LABELS: Record<RunSetupStep, string> = {
  persona: '01 / Choose Background',
  tool: '02 / Choose Starter Tool',
  skills: '03 / Choose Seed Skills',
  idea: '04 / Choose First Idea',
  confirm: '05 / Confirm',
};

function EffectList({ effects }: { effects: Array<{ type: string; stat: string; value: number }> }) {
  return (
    <ul className={styles.effectList}>
      {effects.map((e, i) => {
        const sign = e.value >= 0 ? '+' : '';
        const pct = e.type === 'multiplier' ? `${sign}${(e.value * 100).toFixed(0)}% ${e.stat}` : `${sign}${e.value} ${e.stat}`;
        const cls = e.value >= 0 ? 'text-green' : 'text-red';
        return <li key={i} className={cls}>{pct}</li>;
      })}
    </ul>
  );
}

export function RunSetupScreen() {
  const step = useGameStore(s => s.ui.runSetupStep);
  const selections = useGameStore(s => s.ui.runSetupSelections);
  const setStep = useGameStore(s => s.setRunSetupStep);
  const setSelection = useGameStore(s => s.setRunSetupSelection);
  const startRun = useGameStore(s => s.startRun);
  const setScreen = useGameStore(s => s.setScreen);

  const stepIndex = STEPS.indexOf(step);

  function goBack() {
    if (stepIndex === 0) {
      setScreen('start');
    } else {
      setStep(STEPS[stepIndex - 1]);
    }
  }

  function goNext() {
    setStep(STEPS[stepIndex + 1]);
  }

  function handleStart() {
    if (!selections.personaId || !selections.toolId || selections.skillIds.length < 2 || !selections.ideaId) return;
    startRun({
      personaId: selections.personaId,
      toolId: selections.toolId,
      skillIds: selections.skillIds,
      ideaId: selections.ideaId,
    });
  }

  const canAdvance = (() => {
    if (step === 'persona') return !!selections.personaId;
    if (step === 'tool') return !!selections.toolId;
    if (step === 'skills') return selections.skillIds.length === 2;
    if (step === 'idea') return !!selections.ideaId;
    return true;
  })();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={goBack}>← back</button>
        <span className={styles.stepLabel}>{STEP_LABELS[step]}</span>
      </div>

      <div className={styles.content}>
        {step === 'persona' && (
          <div className={styles.grid}>
            {PERSONAS.map(p => (
              <div
                key={p.id}
                className={[styles.card, selections.personaId === p.id ? styles.selected : ''].join(' ')}
                onClick={() => setSelection('personaId', p.id)}
              >
                <div className={styles.cardName}>{p.name}</div>
                <div className={styles.cardTagline}>{p.tagline}</div>
                <div className={styles.cardDesc}>{p.description}</div>
                <EffectList effects={[...p.bonuses, ...p.weaknesses]} />
                {p.startingPassive && <div className={styles.passive}>{p.startingPassive}</div>}
              </div>
            ))}
          </div>
        )}

        {step === 'tool' && (
          <div className={styles.grid}>
            {STARTER_TOOLS.map(t => (
              <div
                key={t.id}
                className={[styles.card, selections.toolId === t.id ? styles.selected : ''].join(' ')}
                onClick={() => setSelection('toolId', t.id)}
              >
                <div className={styles.cardName}>{t.name}</div>
                <div className={styles.cardTagline}>{t.tagline}</div>
                <div className={styles.cardDesc}>{t.description}</div>
                <EffectList effects={t.effects} />
              </div>
            ))}
          </div>
        )}

        {step === 'skills' && (
          <>
            <div className={styles.skillHint}>
              Select 2 seed skills ({selections.skillIds.length}/2)
            </div>
            <div className={styles.skillGrid}>
              {SKILLS.map(sk => {
                const isSelected = selections.skillIds.includes(sk.id);
                const isDisabled = !isSelected && selections.skillIds.length >= 2;
                return (
                  <div
                    key={sk.id}
                    className={[
                      styles.skillCard,
                      isSelected ? styles.selected : '',
                      isDisabled ? styles.disabled : '',
                    ].join(' ')}
                    onClick={() => {
                      if (isDisabled) return;
                      if (isSelected) {
                        setSelection('skillIds', selections.skillIds.filter(id => id !== sk.id));
                      } else {
                        setSelection('skillIds', [...selections.skillIds, sk.id]);
                      }
                    }}
                  >
                    <div className={styles.cardName}>{sk.name}</div>
                    <div className={styles.cardDesc}>{sk.description}</div>
                    <EffectList effects={sk.effects} />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === 'idea' && (
          <div className={styles.grid}>
            {IDEAS.map(idea => (
              <div
                key={idea.id}
                className={[styles.card, selections.ideaId === idea.id ? styles.selected : ''].join(' ')}
                onClick={() => setSelection('ideaId', idea.id)}
              >
                <div className={styles.cardName}>{idea.name}</div>
                <div className={styles.cardTagline}>{idea.tagline}</div>
                <div className={styles.cardDesc}>{idea.description}</div>
                <div className={styles.ideaMeta}>
                  <span>complexity: {'▮'.repeat(idea.complexity)}{'▯'.repeat(3 - idea.complexity)}</span>
                  <span>hype: {idea.hypeProfile}</span>
                  <span>income: {idea.incomeModel}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 'confirm' && (
          <div className={styles.confirm}>
            <div className={styles.confirmRow}>
              <span className="text-dim">Persona</span>
              <span>{PERSONAS.find(p => p.id === selections.personaId)?.name}</span>
            </div>
            <div className={styles.confirmRow}>
              <span className="text-dim">Tool</span>
              <span>{STARTER_TOOLS.find(t => t.id === selections.toolId)?.name}</span>
            </div>
            <div className={styles.confirmRow}>
              <span className="text-dim">Skills</span>
              <span>{selections.skillIds.map(id => SKILLS.find(s => s.id === id)?.name).join(', ')}</span>
            </div>
            <div className={styles.confirmRow}>
              <span className="text-dim">First Idea</span>
              <span>{IDEAS.find(i => i.id === selections.ideaId)?.name}</span>
            </div>
            <div className={styles.startPrompt}>Good luck. You are going to need it.</div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {step !== 'confirm' ? (
          <Button onClick={goNext} disabled={!canAdvance}>
            Next →
          </Button>
        ) : (
          <Button onClick={handleStart} variant="primary">
            Start Run
          </Button>
        )}
      </div>
    </div>
  );
}
