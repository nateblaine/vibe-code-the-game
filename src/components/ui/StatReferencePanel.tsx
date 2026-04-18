import { Panel } from './Panel';
import { TooltipLabel } from './TooltipLabel';
import styles from './StatReferencePanel.module.css';

const SECTIONS = [
  {
    title: 'How You Reach $1M',
    items: [
      ['Progress Bar', 'The progress bar tracks your win score: Cash + Lifetime Earned + Valuation Bonus. In the current build, most of that comes from building cash and lifetime earned.'],
      ['Idea Flow', 'Assign capacity to an idea, push it through Concept and Prototype, then reach Launch. Launch is the point where it starts producing income each tick.'],
      ['Launch Revenue → Income / Tick', 'Once an idea is live, its stored revenue value is converted into Income / Tick. More live revenue means more cash arriving every tick.'],
      ['Net / Tick', 'Net is Income / Tick minus Burn / Tick. Positive net grows cash. Negative net drains runway.'],
      ['Best Path To Money', 'Get an idea launched quickly, keep burn under control, then buy upgrades that improve monetization, quality, hype, or cost efficiency.'],
    ],
  },
  {
    title: 'Core Resources',
    items: [
      ['Cash', 'Your current money. If burn stays higher than income for too long, cash loss becomes the burn failure condition.'],
      ['Compute', 'A spare operating resource used mainly by events. It is not direct revenue, but a healthy buffer gives you better event choices.'],
      ['Focus', 'Founder stamina. Tech debt and bad events chip away at it. If Focus hits zero, the run ends immediately.'],
      ['Reputation', 'Public trust and attention. It improves certain event outcomes and supports hype-driven growth. If it crashes too far, you lose on reputation.'],
      ['Tech Debt', 'Structural mess created by active work. High debt drains focus every tick, which indirectly kills your ability to stay in the run long enough to make money.'],
    ],
  },
  {
    title: 'Growth & Capacity',
    items: [
      ['Agent Capacity', 'Your total available builder slots. More capacity means more progress per tick or room to support multiple ideas.'],
      ['Assigned Capacity', 'The amount of your total capacity currently pointed at a specific idea. More assigned capacity means faster progress on that idea.'],
      ['Progress', 'Each tick, assigned capacity pushes an idea toward its next stage. Faster progress gets you to Launch, where money starts.'],
      ['Idea Stage', 'Concept → Prototype → Launch → Growth → Scale → Plateau. Launch starts revenue. Growth and Scale increase tick income faster.'],
      ['Automation / Quality / Hype', 'These stats amplify how efficiently you operate, how strong launches are, and how quickly live ideas grow once they have momentum.'],
    ],
  },
  {
    title: 'Run Safety',
    items: [
      ['Burn / Tick', 'What the company spends every tick. Lowering burn is one of the cleanest ways to survive long enough for income to matter.'],
      ['Income / Tick', 'What your launched ideas are paying you right now. This is the direct bridge from product progress to cash growth.'],
      ['Net / Tick', 'Your most important sanity check. Positive net means the business is compounding. Negative net means you are on a timer.'],
      ['Stability', 'A resilience stat used by events and operational outcomes. It does not pay directly, but it helps you avoid losing progress to incidents.'],
      ['Event Loop', 'Events only fire when your run has eligible situations. They open on a random window and eventually get forced, so event pressure is part of the economy.'],
    ],
  },
  {
    title: 'Reference',
    items: [
      ['Day / Night Clock', 'The in-world clock advances with the sim. In this build, 6 real-time ticks equals 1 in-game hour.'],
      ['Run Clock Tick Marks', 'The clock card shows both the current in-game time and which of the 6 hourly ticks you are on.'],
      ['Upgrade Effects', 'Upgrade cards show their direct stat changes. Look for monetization, quality, hype, debt reduction, and burn reduction when optimizing for cash growth.'],
      ['Quick Rule Of Thumb', 'Launch fast, turn net positive, keep cash above zero, then stack upgrades that either raise income or reduce burn.'],
    ],
  },
];

interface StatReferencePanelProps {
  title?: string;
}

export function StatReferencePanel({ title = 'Stat Guide' }: StatReferencePanelProps) {
  return (
    <Panel title={title} raised scrollable className={styles.panel}>
      <div className={styles.sections}>
        {SECTIONS.map(section => (
          <div key={section.title} className={styles.section}>
            <div className={styles.sectionTitle}>{section.title}</div>
            <div className={styles.items}>
              {section.items.map(([label, copy]) => (
                <div key={label} className={styles.item}>
                  <TooltipLabel tooltip={copy} className={styles.itemLabel}>
                    {label}
                  </TooltipLabel>
                  <span className={styles.itemCopy}>{copy}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
