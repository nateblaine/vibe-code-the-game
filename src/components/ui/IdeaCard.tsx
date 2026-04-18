import { useGameStore } from '../../hooks/useGameStore';
import { IDEAS } from '../../content/ideas';
import { calcIncomePerTickFromMrr } from '../../core/formulas';
import styles from './IdeaCard.module.css';

const STAGE_COLORS = {
  concept: 'var(--color-text-dim)',
  prototype: 'var(--color-yellow)',
  launch: 'var(--color-green)',
  growth: 'var(--color-accent)',
  scale: 'var(--color-purple)',
  plateau: 'var(--color-text-dim)',
};

interface IdeaCardProps {
  ideaId: string;
}

export function IdeaCard({ ideaId }: IdeaCardProps) {
  const gameState = useGameStore(s => s.gameState);
  const adjustCapacity = useGameStore(s => s.adjustCapacity);

  if (!gameState) return null;

  const ideaDef = IDEAS.find(i => i.id === ideaId);
  const idea = gameState.ideas[ideaId];
  if (!ideaDef || !idea) return null;

  const maxCapacity = gameState.derived.agentCapacity;
  const totalAssigned = gameState.activeIdeaIds.reduce(
    (sum, id) => sum + (gameState.ideas[id]?.assignedCapacity ?? 0),
    0
  );
  const canIncrease = idea.assignedCapacity < maxCapacity && totalAssigned < maxCapacity;
  const canDecrease = idea.assignedCapacity > 0;

  // Progress to next stage
  const stageIndex = ['concept', 'prototype', 'launch', 'growth', 'scale', 'plateau'].indexOf(idea.stage);
  const threshold = ideaDef.stageThresholds[stageIndex] ?? ideaDef.stageThresholds[4];
  const prevThreshold = stageIndex > 0 ? ideaDef.stageThresholds[stageIndex - 1] ?? 0 : 0;
  const progressInStage = idea.progress - prevThreshold;
  const stageRange = threshold - prevThreshold;
  const progressPct = Math.min(100, stageRange > 0 ? (progressInStage / stageRange) * 100 : 100);
  const ideaIncomePerTick = idea.mrr > 0 ? calcIncomePerTickFromMrr(gameState, idea.mrr) : 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.name}>{ideaDef.name}</div>
        <div className={styles.stage} style={{ color: STAGE_COLORS[idea.stage] }}>
          {idea.stage.toUpperCase()}
        </div>
      </div>

      <div className={styles.progressRow}>
        <div className="progress-bar" style={{ flex: 1 }}>
          <div className="progress-bar__fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className={styles.progressPct}>{progressPct.toFixed(0)}%</span>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className="text-dim">Income/tick</span>
          <span className="text-green">
            {ideaIncomePerTick > 0 ? `$${ideaIncomePerTick.toFixed(2)}` : '--'}
          </span>
        </div>
        <div className={styles.stat}>
          <span className="text-dim">Debt/tick</span>
          <span className={ideaDef.debtGainRate > 0.3 ? 'text-red' : 'text-dim'}>
            +{ideaDef.debtGainRate.toFixed(2)}
          </span>
        </div>
        <div className={styles.stat}>
          <span className="text-dim">Maintenance</span>
          <span>{'▮'.repeat(ideaDef.maintenanceLoad)}{'▯'.repeat(3 - ideaDef.maintenanceLoad)}</span>
        </div>
      </div>

      <div className={styles.capacityRow}>
        <span className="text-dim">Capacity</span>
        <div className={styles.capacityControls}>
          <button
            className={styles.capacityBtn}
            onClick={() => adjustCapacity(ideaId, -1)}
            disabled={!canDecrease}
          >
            −
          </button>
          <div className={styles.capacityDots}>
            {Array.from({ length: maxCapacity }, (_, i) => (
              <span
                key={i}
                className={i < idea.assignedCapacity ? styles.dotFilled : styles.dotEmpty}
              />
            ))}
          </div>
          <button
            className={styles.capacityBtn}
            onClick={() => adjustCapacity(ideaId, 1)}
            disabled={!canIncrease}
          >
            +
          </button>
          <span className={styles.capacityCount}>{idea.assignedCapacity}/{maxCapacity}</span>
        </div>
      </div>
    </div>
  );
}
