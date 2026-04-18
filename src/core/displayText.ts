export interface EffectDisplay {
  type: 'flat' | 'multiplier';
  stat: string;
  value: number;
}

const STAT_META: Record<string, { label: string; positiveGood?: boolean; description?: string }> = {
  cash: { label: 'Cash', positiveGood: true, description: 'Current money on hand. If cash reaches zero, the run ends on burn.' },
  compute: { label: 'Compute', positiveGood: true, description: 'Extra execution headroom. Events often spend or restore this directly.' },
  focus: { label: 'Focus', positiveGood: true, description: 'Founder stamina. Low focus makes the run fragile and hitting zero ends it.' },
  reputation: { label: 'Reputation', positiveGood: true, description: 'Market trust and attention. Some events and growth systems care about it.' },
  technicalDebt: { label: 'Tech Debt', positiveGood: false, description: 'Structural mess. High debt drains focus and pushes the run toward failure.' },
  burnRate: { label: 'Burn Rate', positiveGood: false, description: 'Cash spent per tick. Lower is safer.' },
  agentCapacity: { label: 'Agent Capacity', positiveGood: true, description: 'How many total capacity points you can assign across ideas.' },
  automationLevel: { label: 'Automation', positiveGood: true, description: 'How much of the machine is running without you.' },
  stability: { label: 'Stability', positiveGood: true, description: 'Operational resilience. Higher stability means fewer ugly outcomes.' },
  hypeMultiplier: { label: 'Hype', positiveGood: true, description: 'Momentum multiplier for attention and growth phases.' },
  incomePerTick: { label: 'Income / Tick', positiveGood: true, description: 'Revenue arriving each simulation tick from launched ideas.' },
  netPerTick: { label: 'Net / Tick', positiveGood: true, description: 'Income minus burn. Positive net grows cash; negative net drains it.' },
  computeEfficiency: { label: 'Compute Efficiency', positiveGood: true, description: 'Makes each unit of work cheaper.' },
  qualityMultiplier: { label: 'Quality', positiveGood: true, description: 'Improves how strong your output is when ideas hit key milestones.' },
  debtGainRate: { label: 'Debt Gain', positiveGood: false, description: 'How fast active work creates technical debt.' },
  outageSeverity: { label: 'Outage Severity', positiveGood: false, description: 'How painful incidents are when they happen.' },
  eventUpside: { label: 'Event Upside', positiveGood: true, description: 'Improves favorable event outcomes.' },
  focusInstability: { label: 'Focus Instability', positiveGood: false, description: 'Makes your concentration swing harder.' },
  reputationGain: { label: 'Reputation Gain', positiveGood: true, description: 'Amplifies positive reputation changes.' },
  directMonetization: { label: 'Monetization', positiveGood: true, description: 'Improves how much launched ideas convert into income.' },
  ideaProgress: { label: 'Idea Progress', positiveGood: true, description: 'Speeds up development progress on active ideas.' },
  upgradeDiscount: { label: 'Upgrade Discount', positiveGood: true, description: 'Lowers effective upgrade costs.' },
};

function getMeta(stat: string) {
  return STAT_META[stat] ?? { label: stat.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()), positiveGood: true };
}

export function getStatLabel(stat: string): string {
  return getMeta(stat).label;
}

export function getStatDescription(stat: string): string | undefined {
  return getMeta(stat).description;
}

export function getEffectTone(effect: EffectDisplay): 'good' | 'bad' | 'neutral' {
  if (effect.value === 0) return 'neutral';
  const positiveGood = getMeta(effect.stat).positiveGood ?? true;
  const isGood = positiveGood ? effect.value > 0 : effect.value < 0;
  return isGood ? 'good' : 'bad';
}

export function formatEffect(effect: EffectDisplay): string {
  const label = getStatLabel(effect.stat);
  const sign = effect.value >= 0 ? '+' : '';

  if (effect.type === 'multiplier') {
    return `${sign}${(effect.value * 100).toFixed(0)}% ${label}`;
  }

  const value = Number.isInteger(effect.value) ? effect.value.toString() : effect.value.toFixed(2);
  return `${sign}${value} ${label}`;
}
