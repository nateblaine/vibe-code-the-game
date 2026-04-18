import { useGameStore } from '../../hooks/useGameStore';
import { PERSONAS } from '../../content/personas';
import { STARTER_TOOLS } from '../../content/starterTools';
import { SKILLS } from '../../content/skills';
import { IDEAS } from '../../content/ideas';
import { Button } from '../ui/Button';
import { ModifierList } from '../ui/ModifierList';
import { StatReferencePanel } from '../ui/StatReferencePanel';
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

function sample<T>(items: T[], count = 1): T[] {
  const copy = [...items];
  const result: T[] = [];

  while (copy.length > 0 && result.length < count) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }

  return result;
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

  function advanceFrom(currentStep: RunSetupStep) {
    const currentIndex = STEPS.indexOf(currentStep);
    const nextStep = STEPS[currentIndex + 1];
    if (nextStep) {
      setStep(nextStep);
    }
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

  function applyRandomLoadout() {
    const [persona] = sample(PERSONAS);
    const [tool] = sample(STARTER_TOOLS);
    const randomSkills = sample(SKILLS, 2);
    const [idea] = sample(IDEAS);

    if (!persona || !tool || randomSkills.length < 2 || !idea) return;

    setSelection('personaId', persona.id);
    setSelection('toolId', tool.id);
    setSelection('skillIds', randomSkills.map(skill => skill.id));
    setSelection('ideaId', idea.id);
    setStep('confirm');
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
        <button className={styles.randomBtn} onClick={applyRandomLoadout}>Random Loadout</button>
      </div>

      <div className={styles.content}>
        {step === 'persona' && (
          <div className={styles.grid}>
            {PERSONAS.map(p => (
              <div
                key={p.id}
                className={[styles.card, selections.personaId === p.id ? styles.selected : ''].join(' ')}
                onClick={() => {
                  setSelection('personaId', p.id);
                  advanceFrom('persona');
                }}
              >
                <div className={styles.cardName}>{p.name}</div>
                <div className={styles.cardTagline}>{p.tagline}</div>
                <div className={styles.cardDesc}>{p.description}</div>
                <ModifierList effects={[...p.bonuses, ...p.weaknesses]} />
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
                onClick={() => {
                  setSelection('toolId', t.id);
                  advanceFrom('tool');
                }}
              >
                <div className={styles.cardName}>{t.name}</div>
                <div className={styles.cardTagline}>{t.tagline}</div>
                <div className={styles.cardDesc}>{t.description}</div>
                <ModifierList effects={t.effects} />
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
                        const nextSkillIds = [...selections.skillIds, sk.id];
                        setSelection('skillIds', nextSkillIds);
                        if (nextSkillIds.length === 2) {
                          advanceFrom('skills');
                        }
                      }
                    }}
                  >
                    <div className={styles.cardName}>{sk.name}</div>
                    <div className={styles.cardDesc}>{sk.description}</div>
                    <ModifierList effects={sk.effects} />
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
                onClick={() => {
                  setSelection('ideaId', idea.id);
                  advanceFrom('idea');
                }}
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
          <div className={styles.confirmLayout}>
            <div className={styles.confirm}>
              <div className={styles.confirmRow}>
                <span className={[styles.confirmLabel, 'text-dim'].join(' ')}>Persona</span>
                <span className={styles.confirmValue}>{PERSONAS.find(p => p.id === selections.personaId)?.name}</span>
              </div>
              <div className={styles.confirmRow}>
                <span className={[styles.confirmLabel, 'text-dim'].join(' ')}>Tool</span>
                <span className={styles.confirmValue}>{STARTER_TOOLS.find(t => t.id === selections.toolId)?.name}</span>
              </div>
              <div className={styles.confirmRow}>
                <span className={[styles.confirmLabel, 'text-dim'].join(' ')}>Skills</span>
                <span className={styles.confirmValue}>{selections.skillIds.map(id => SKILLS.find(s => s.id === id)?.name).join(', ')}</span>
              </div>
              <div className={styles.confirmRow}>
                <span className={[styles.confirmLabel, 'text-dim'].join(' ')}>First Idea</span>
                <span className={styles.confirmValue}>{IDEAS.find(i => i.id === selections.ideaId)?.name}</span>
              </div>
              <div className={styles.startPrompt}>This screen is your briefing: build summary on the left, stat guide on the right.</div>
            </div>

            <StatReferencePanel title="Run Briefing" />
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
