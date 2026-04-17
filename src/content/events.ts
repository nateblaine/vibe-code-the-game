import type { EventDefinition } from '../types/content';

export const EVENTS: EventDefinition[] = [
  // --- Tooling ---
  {
    id: 'prompt-rot',
    title: 'Prompt Rot',
    category: 'tooling',
    description: 'A prompt chain that was working fine last week has started returning confidently wrong output. The model has drifted, your prompts have not, and something has to give.',
    weight: 8,
    cooldown: 120,
    minRunTick: 20,
    choices: [
      {
        label: 'Refactor the prompts',
        description: 'Take the hit now. Fix the chain properly.',
        effects: [
          { type: 'flat', stat: 'technicalDebt', value: -8 },
          { type: 'flat', stat: 'compute', value: -10 },
        ],
        logMessage: 'You rewrote the prompt chain. Cleaner now. Briefly.',
      },
      {
        label: 'Patch around it',
        description: 'Add a validation layer and move on.',
        effects: [
          { type: 'flat', stat: 'technicalDebt', value: 5 },
          { type: 'flat', stat: 'compute', value: -3 },
        ],
        logMessage: 'You wrapped the problem in another problem. The chain works. Technically.',
      },
      {
        label: 'Double down, accept debt',
        description: 'Stack more conditions. See what happens.',
        effects: [
          { type: 'flat', stat: 'technicalDebt', value: 15 },
          { type: 'flat', stat: 'compute', value: -1 },
        ],
        logMessage: 'The prompt is now 1,400 tokens and has a comment that says "do not touch this."',
      },
    ],
    tags: ['prompting', 'debt'],
  },
  {
    id: 'hallucinated-migration',
    title: 'Hallucinated Migration',
    category: 'tooling',
    description: 'An agent confidently migrated a core component to a framework feature that, upon inspection, does not exist. The docs were cited. The docs were for a different version.',
    weight: 6,
    cooldown: 180,
    minRunTick: 40,
    choices: [
      {
        label: 'Roll back immediately',
        description: 'Painful but clean. The agent gets flagged.',
        effects: [
          { type: 'flat', stat: 'technicalDebt', value: -5 },
          { type: 'flat', stat: 'focus', value: -5 },
          { type: 'flat', stat: 'compute', value: -8 },
        ],
        logMessage: 'You rolled back. There is a note in the runbook now. There will be another incident.',
      },
      {
        label: 'Patch it live',
        description: 'Write the feature that should have existed. Ship it.',
        effects: [
          { type: 'flat', stat: 'technicalDebt', value: 12 },
          { type: 'flat', stat: 'compute', value: -15 },
          { type: 'flat', stat: 'cash', value: -50 },
        ],
        logMessage: 'You shipped the shim. Heroic. Exhausting. Technically functional.',
      },
    ],
    tags: ['agents', 'debt', 'stability'],
  },

  // --- Product ---
  {
    id: 'demo-that-should-not-have-worked',
    title: 'The Demo That Should Not Have Worked',
    category: 'product',
    description: 'You demoed a rough prototype. It crashed twice and still impressed a small but credible audience. Now there is a thread.',
    weight: 7,
    cooldown: 200,
    minRunTick: 30,
    choices: [
      {
        label: 'Polish and capitalize',
        description: 'Sprint on the demo use case. Ride the wave.',
        effects: [
          { type: 'flat', stat: 'reputation', value: 15 },
          { type: 'flat', stat: 'technicalDebt', value: 8 },
          { type: 'flat', stat: 'compute', value: -10 },
        ],
        logMessage: 'You doubled down. The polished version landed. Debt is up but the hype is real.',
      },
      {
        label: 'Cash out with consulting',
        description: 'Offer to build them a custom version. $$ now, delay product.',
        effects: [
          { type: 'flat', stat: 'cash', value: 800 },
          { type: 'flat', stat: 'focus', value: -8 },
        ],
        logMessage: 'Three calls later, you have a consulting engagement and a product slightly behind schedule.',
      },
      {
        label: 'Ignore and keep building',
        description: 'Do not chase the hype. Build the real thing first.',
        effects: [
          { type: 'flat', stat: 'reputation', value: 5 },
        ],
        logMessage: 'You ignored the thread. It faded. The product is better for it.',
      },
    ],
    tags: ['hype', 'product', 'launch'],
  },
  {
    id: 'free-trial-locusts',
    title: 'Free Trial Locusts',
    category: 'product',
    description: 'Signups spiked after a mention. Conversions have not moved. Your free tier is supporting 200 users who have no intention of paying.',
    weight: 9,
    cooldown: 150,
    minRunTick: 60,
    choices: [
      {
        label: 'Tighten the paywall',
        description: 'Remove features from free. Some users will leave. Some will pay.',
        effects: [
          { type: 'flat', stat: 'cash', value: 400 },
          { type: 'flat', stat: 'reputation', value: -8 },
          { type: 'flat', stat: 'burnRate', value: -5 },
        ],
        logMessage: 'Churn was loud. Revenue ticked up. A blog post called you "another VC-brained startup." You are not VC-backed.',
      },
      {
        label: 'Extend the trial',
        description: 'More time to activate. Higher burn, higher potential.',
        effects: [
          { type: 'flat', stat: 'burnRate', value: 8 },
          { type: 'flat', stat: 'reputation', value: 5 },
        ],
        logMessage: 'You extended it. More users are in the funnel. The funnel is wide. The bottom is uncertain.',
      },
      {
        label: 'Add waitlist friction',
        description: 'Require an application. Exclusivity up, signups down, quality up.',
        effects: [
          { type: 'flat', stat: 'reputation', value: 10 },
          { type: 'flat', stat: 'burnRate', value: -3 },
        ],
        logMessage: 'The waitlist created scarcity. You have 40 applications and 38 of them are real.',
      },
    ],
    tags: ['product', 'monetization', 'growth'],
  },

  // --- Team / Agent ---
  {
    id: 'agent-has-opinions',
    title: 'The Agent Has Opinions',
    category: 'team',
    description: 'A specialized sub-agent is productive, confident, and has begun rewriting parts of the system you did not ask it to rewrite. The output is good. The autonomy is concerning.',
    weight: 6,
    cooldown: 180,
    minRunTick: 50,
    choices: [
      {
        label: 'Sandbox it',
        description: 'Restrict its write permissions. Slower but safer.',
        effects: [
          { type: 'flat', stat: 'technicalDebt', value: -5 },
          { type: 'flat', stat: 'compute', value: -5 },
        ],
        logMessage: 'The agent is sandboxed. It sulks visibly. The diffs are cleaner.',
      },
      {
        label: 'Promote it',
        description: 'Give it more context and more scope. Double down.',
        effects: [
          { type: 'flat', stat: 'compute', value: 15 },
          { type: 'flat', stat: 'technicalDebt', value: 10 },
        ],
        logMessage: 'You promoted it. Output doubled. Something in the auth layer is different and you are not sure when that changed.',
      },
      {
        label: 'Throttle it',
        description: 'Keep the output, limit the blast radius.',
        effects: [
          { type: 'flat', stat: 'compute', value: 5 },
          { type: 'flat', stat: 'technicalDebt', value: 3 },
        ],
        logMessage: 'Throttled. It still rewrites things sometimes. You have accepted this.',
      },
    ],
    tags: ['agents', 'debt', 'autonomy'],
  },
  {
    id: 'review-bot-revolt',
    title: 'Review Bot Revolt',
    category: 'team',
    description: 'Your code review agent has started nitpicking variable names and ignoring actual logic errors. It has flagged your README four times.',
    weight: 5,
    cooldown: 200,
    minRunTick: 80,
    choices: [
      {
        label: 'Retrain the rules',
        description: 'Tune its heuristics. Takes time.',
        effects: [
          { type: 'flat', stat: 'compute', value: -10 },
          { type: 'flat', stat: 'qualityMultiplier', value: 0.10 },
        ],
        logMessage: 'The rules are tighter now. The bot is useful again. Until the next model update.',
      },
      {
        label: 'Fire it',
        description: 'Remove the agent. Review manually or not at all.',
        effects: [
          { type: 'flat', stat: 'technicalDebt', value: 8 },
          { type: 'flat', stat: 'focus', value: 5 },
        ],
        logMessage: 'The bot is gone. Code review is vibes-based again. Merges are faster.',
      },
    ],
    tags: ['agents', 'quality'],
  },

  // --- Infra ---
  {
    id: 'token-bill-jump-scare',
    title: 'Token Bill Jump Scare',
    category: 'infra',
    description: 'A "small" architecture change introduced a redundant inference pass. You just got the bill. The number has too many digits.',
    weight: 10,
    cooldown: 120,
    minRunTick: 30,
    triggerConditions: [
      { type: 'resource_above', key: 'burnRate', value: 10 },
    ],
    choices: [
      {
        label: 'Optimize now',
        description: 'Find and kill the redundant calls. Takes focus.',
        effects: [
          { type: 'flat', stat: 'burnRate', value: -15 },
          { type: 'flat', stat: 'focus', value: -8 },
          { type: 'flat', stat: 'compute', value: -5 },
        ],
        logMessage: 'You found the loop. Eliminated it. Bill drops next cycle.',
      },
      {
        label: 'Raise prices',
        description: 'Pass the cost on. Some customers will leave.',
        effects: [
          { type: 'flat', stat: 'cash', value: 300 },
          { type: 'flat', stat: 'reputation', value: -5 },
        ],
        logMessage: 'You raised prices by 20%. Three customers left. Revenue is up.',
      },
      {
        label: 'Eat the cost for growth',
        description: 'Absorb it. Users see no degradation. You see the burn.',
        effects: [
          { type: 'flat', stat: 'cash', value: -400 },
          { type: 'flat', stat: 'reputation', value: 3 },
        ],
        logMessage: 'You paid the bill. No one noticed. That is the point.',
      },
    ],
    tags: ['infra', 'burn', 'compute'],
  },
  {
    id: 'cheap-vps-expensive-lesson',
    title: 'Cheap VPS, Expensive Lesson',
    category: 'infra',
    description: 'You migrated to a bargain VPS provider last month. The app is now intermittently unreachable for reasons the support ticket describes as "normal behavior."',
    weight: 7,
    cooldown: 200,
    minRunTick: 45,
    choices: [
      {
        label: 'Migrate back',
        description: 'Cost goes up. Reliability goes up. Sanity is preserved.',
        effects: [
          { type: 'flat', stat: 'burnRate', value: 8 },
          { type: 'flat', stat: 'reputation', value: 5 },
          { type: 'flat', stat: 'technicalDebt', value: -5 },
        ],
        logMessage: 'You migrated back. Costs are up. Nothing is haunted anymore.',
      },
      {
        label: 'Endure it',
        description: 'Save the money. Accept occasional ghosts.',
        effects: [
          { type: 'flat', stat: 'reputation', value: -10 },
          { type: 'flat', stat: 'technicalDebt', value: 5 },
        ],
        logMessage: 'Users are reporting timeouts. You are telling them to hard refresh.',
      },
      {
        label: 'Add monitoring only',
        description: 'At least you will know when it breaks.',
        effects: [
          { type: 'flat', stat: 'stability', value: 0.05 },
          { type: 'flat', stat: 'cash', value: -80 },
        ],
        logMessage: 'You added monitoring. You now have graphs of the chaos.',
      },
    ],
    tags: ['infra', 'stability', 'reputation'],
  },

  // --- Reputation ---
  {
    id: 'viral-thread-wrong-audience',
    title: 'Viral Thread, Wrong Audience',
    category: 'reputation',
    description: 'Your post went semi-viral. Unfortunately among people who find your product interesting as a concept and have no intention of using it.',
    weight: 8,
    cooldown: 180,
    minRunTick: 20,
    choices: [
      {
        label: 'Milk the reputation',
        description: 'Boost signal while it lasts. Retweet everything.',
        effects: [
          { type: 'flat', stat: 'reputation', value: 20 },
          { type: 'flat', stat: 'focus', value: -5 },
        ],
        logMessage: 'Reputation up. Conversions flat. The number looks good in a screenshot.',
      },
      {
        label: 'Pivot messaging',
        description: 'Use this audience to refine your pitch.',
        effects: [
          { type: 'flat', stat: 'reputation', value: 8 },
          { type: 'flat', stat: 'directMonetization', value: 0.05 },
        ],
        logMessage: 'You rewrote the landing page for a more commercial audience. Engagement dropped. Signups did not.',
      },
      {
        label: 'Convert to community project',
        description: 'Lean into the audience you have. OSS-adjacent pivot.',
        effects: [
          { type: 'flat', stat: 'reputation', value: 15 },
          { type: 'flat', stat: 'directMonetization', value: -0.10 },
        ],
        logMessage: 'You opened the repo. Stars incoming. Revenue model: unknown.',
      },
    ],
    tags: ['reputation', 'hype', 'community'],
  },
  {
    id: 'ai-wrapper-discourse',
    title: 'AI Wrapper Discourse',
    category: 'reputation',
    description: 'Someone with a verified checkmark has described your product as "just a wrapper." The post has traction. The reply section is a war.',
    weight: 9,
    cooldown: 200,
    minRunTick: 60,
    choices: [
      {
        label: 'Lean into it',
        description: '"Yes, we are a wrapper. So is every database driver." No shame.',
        effects: [
          { type: 'flat', stat: 'reputation', value: 12 },
          { type: 'flat', stat: 'hypeMultiplier', value: 0.08 },
        ],
        logMessage: 'You called it a wrapper. Loudly. Defiantly. The discourse crew loves the audacity.',
      },
      {
        label: 'Over-engineer defensively',
        description: 'Ship a technically impressive architectural layer. Own the narrative.',
        effects: [
          { type: 'flat', stat: 'technicalDebt', value: 15 },
          { type: 'flat', stat: 'compute', value: -15 },
          { type: 'flat', stat: 'reputation', value: 8 },
        ],
        logMessage: 'You built an abstraction layer nobody asked for. The architecture post did numbers.',
      },
      {
        label: 'Publish technical breakdown',
        description: 'Write a measured, specific post explaining what you actually built.',
        effects: [
          { type: 'flat', stat: 'reputation', value: 18 },
          { type: 'flat', stat: 'focus', value: -5 },
        ],
        logMessage: 'The post was good. Thorough. The discourse crowd found a new target the next day.',
      },
    ],
    tags: ['reputation', 'community', 'hype'],
  },

  // --- Legal / Platform ---
  {
    id: 'compliance-email',
    title: 'Compliance Email',
    category: 'legal',
    description: 'A vendor platform sent a formal email requesting clarification on your data handling practices. The tone is polite. The legal weight is ambiguous.',
    weight: 5,
    cooldown: 300,
    minRunTick: 70,
    choices: [
      {
        label: 'Get proper documentation',
        description: 'Write actual privacy docs. Takes focus, removes risk.',
        effects: [
          { type: 'flat', stat: 'focus', value: -10 },
          { type: 'flat', stat: 'reputation', value: 5 },
          { type: 'flat', stat: 'technicalDebt', value: -3 },
        ],
        logMessage: 'You wrote the docs. They are accurate. You feel briefly like a responsible adult.',
      },
      {
        label: 'Rewrite the surface docs',
        description: 'Update the public-facing language without changing anything.',
        effects: [
          { type: 'flat', stat: 'focus', value: -3 },
        ],
        logMessage: 'The docs say "privacy-first" now. Nothing has changed architecturally.',
      },
      {
        label: 'Hope it goes away',
        description: 'Do not reply. Low effort, non-zero risk.',
        effects: [
          { type: 'flat', stat: 'technicalDebt', value: 5 },
        ],
        logMessage: 'You did not reply. The email was followed up once and then went quiet. For now.',
      },
    ],
    tags: ['legal', 'platform', 'compliance'],
  },
  {
    id: 'tos-update',
    title: 'Terms of Service Update',
    category: 'legal',
    description: 'A key upstream platform updated its terms. One clause is vaguely relevant to your use case. The risk is low but real.',
    weight: 4,
    cooldown: 300,
    minRunTick: 90,
    choices: [
      {
        label: 'Adapt to the new terms',
        description: 'Do the work. Costs focus but eliminates risk.',
        effects: [
          { type: 'flat', stat: 'focus', value: -8 },
          { type: 'flat', stat: 'stability', value: 0.05 },
        ],
        logMessage: 'You read the terms. You changed three things. The risk is gone.',
      },
      {
        label: 'Seek a technical workaround',
        description: 'Route around the clause architecturally.',
        effects: [
          { type: 'flat', stat: 'technicalDebt', value: 10 },
          { type: 'flat', stat: 'compute', value: -5 },
        ],
        logMessage: 'The workaround works. It is not elegant. Legal risk is lower. Technical debt is higher.',
      },
      {
        label: 'Diversify dependencies',
        description: 'Reduce reliance on this platform entirely.',
        effects: [
          { type: 'flat', stat: 'focus', value: -12 },
          { type: 'flat', stat: 'burnRate', value: -5 },
          { type: 'flat', stat: 'stability', value: 0.08 },
        ],
        logMessage: 'You spent a week reducing single-platform risk. Worth it. Eventually.',
      },
    ],
    tags: ['legal', 'platform', 'stability'],
  },

  // --- Personal ---
  {
    id: 'sleep-is-a-feature',
    title: 'Sleep Is a Feature',
    category: 'personal',
    description: 'You have been shipping hard for three weeks. Focus has been declining. Compute feels slow. The agents feel slow too, which is not how that works.',
    weight: 8,
    cooldown: 120,
    minRunTick: 40,
    triggerConditions: [
      { type: 'resource_below', key: 'focus', value: 30 },
    ],
    choices: [
      {
        label: 'Actually rest',
        description: 'Take a deliberate pause. Focus fully recovers.',
        effects: [
          { type: 'flat', stat: 'focus', value: 25 },
          { type: 'flat', stat: 'compute', value: 8 },
        ],
        logMessage: 'You slept eight hours. Your focus returned. You had a shower and everything.',
      },
      {
        label: 'Caffeine through it',
        description: 'Short-term boost. Longer crash.',
        effects: [
          { type: 'flat', stat: 'focus', value: 8 },
          { type: 'flat', stat: 'technicalDebt', value: 5 },
        ],
        logMessage: 'You caffeinated. Focus returned partially. Some of the code you wrote is not good.',
      },
      {
        label: 'Automate around the problem',
        description: 'Set more things to run without you.',
        effects: [
          { type: 'flat', stat: 'automationLevel', value: 0.10 },
          { type: 'flat', stat: 'focus', value: 5 },
          { type: 'flat', stat: 'technicalDebt', value: 8 },
        ],
        logMessage: 'You handed off more tasks. The automation is running. You are still tired.',
      },
    ],
    tags: ['personal', 'focus', 'burnout'],
  },
  {
    id: 'founder-mode',
    title: 'Founder Mode',
    category: 'personal',
    description: 'You can feel a sprint window opening. The kind where you ship in a week what normally takes a month. The cost will show up later.',
    weight: 5,
    cooldown: 240,
    minRunTick: 80,
    choices: [
      {
        label: 'Enter founder mode',
        description: 'Massive short-term output. Significant debt.',
        effects: [
          { type: 'flat', stat: 'compute', value: 30 },
          { type: 'flat', stat: 'technicalDebt', value: 20 },
          { type: 'flat', stat: 'focus', value: -15 },
        ],
        logMessage: 'You entered founder mode. Fourteen ideas shipped in three days. The codebase is temporarily insane.',
      },
      {
        label: 'Decline — stay measured',
        description: 'Preserve focus. Slower but sustainable.',
        effects: [
          { type: 'flat', stat: 'focus', value: 5 },
        ],
        logMessage: 'You passed on the sprint. The pace is steady. No regrets. Probably.',
      },
      {
        label: 'Delegate to automation',
        description: 'Let the agents sprint while you supervise.',
        effects: [
          { type: 'flat', stat: 'compute', value: 15 },
          { type: 'flat', stat: 'technicalDebt', value: 12 },
          { type: 'flat', stat: 'focus', value: -5 },
        ],
        logMessage: 'The agents went hard. Output is high. Three things need to be undone on Monday.',
      },
    ],
    tags: ['personal', 'productivity', 'trade-off'],
  },

  // --- Growth / Hype ---
  {
    id: 'mystery-influencer-mention',
    title: 'Mystery Influencer Mention',
    category: 'reputation',
    description: 'A mid-tier developer creator mentioned your product without warning. Traffic is up. Your onboarding was not designed for this.',
    weight: 6,
    cooldown: 300,
    minRunTick: 30,
    choices: [
      {
        label: 'Capitalize hard',
        description: 'Redirect all focus to capture the traffic.',
        effects: [
          { type: 'flat', stat: 'cash', value: 600 },
          { type: 'flat', stat: 'reputation', value: 12 },
          { type: 'flat', stat: 'focus', value: -10 },
          { type: 'flat', stat: 'technicalDebt', value: 8 },
        ],
        logMessage: 'You scrambled the onboarding. Revenue spiked. Three things broke in staging.',
      },
      {
        label: 'Stay cautious',
        description: 'Do not break things. Capture what converts naturally.',
        effects: [
          { type: 'flat', stat: 'cash', value: 200 },
          { type: 'flat', stat: 'reputation', value: 8 },
        ],
        logMessage: 'You held the line. Some users converted. The spike passed cleanly.',
      },
      {
        label: 'Convert to mailing list',
        description: 'Capture emails now, sell later.',
        effects: [
          { type: 'flat', stat: 'reputation', value: 10 },
          { type: 'multiplier', stat: 'reputationGain', value: 0.05 },
        ],
        logMessage: 'You captured 300 emails. These will be useful in three months when you re-launch.',
      },
    ],
    tags: ['hype', 'growth', 'reputation'],
  },
  {
    id: 'hacker-news-tap',
    title: 'Hacker News Hug',
    category: 'product',
    description: 'You are on the front page. Not number one, but high enough that your infra is being tested in real time.',
    weight: 4,
    cooldown: 400,
    minRunTick: 50,
    choices: [
      {
        label: 'Optimize onboarding fast',
        description: 'Push an onboarding fix while the traffic is here.',
        effects: [
          { type: 'flat', stat: 'cash', value: 900 },
          { type: 'flat', stat: 'reputation', value: 15 },
          { type: 'flat', stat: 'technicalDebt', value: 10 },
          { type: 'flat', stat: 'focus', value: -12 },
        ],
        logMessage: 'You shipped a hotfix in two hours. It helped. The comment section was mixed.',
      },
      {
        label: 'Just collect emails',
        description: 'Do nothing heroic. Capture the mailing list.',
        effects: [
          { type: 'flat', stat: 'reputation', value: 10 },
          { type: 'flat', stat: 'cash', value: 200 },
        ],
        logMessage: 'You added a banner. 400 signups. The post faded by evening.',
      },
      {
        label: 'Pray the infra holds',
        description: 'Do nothing. Let it ride.',
        effects: [
          { type: 'flat', stat: 'reputation', value: 8 },
          { type: 'flat', stat: 'stability', value: -0.05 },
        ],
        logMessage: 'You watched the graphs. Everything held. One endpoint was slow for twenty minutes.',
      },
    ],
    tags: ['hype', 'growth', 'reputation', 'infra'],
  },

  // --- Easter Eggs ---
  {
    id: 'accidental-feature',
    title: 'Accidental Feature',
    category: 'easter-egg',
    description: 'A bug in your data pipeline created an output format that a small cohort of power users has decided they love and now depend on.',
    weight: 4,
    cooldown: 300,
    minRunTick: 60,
    choices: [
      {
        label: 'Keep it and formalize it',
        description: 'The bug is now a feature. Document it.',
        effects: [
          { type: 'flat', stat: 'reputation', value: 12 },
          { type: 'flat', stat: 'technicalDebt', value: 5 },
          { type: 'flat', stat: 'directMonetization', value: 0.08 },
        ],
        logMessage: 'You called it a feature. Changelog updated. Users are delighted. You are slightly embarrassed.',
      },
      {
        label: 'Fix it',
        description: 'Break the dependency. Users will complain.',
        effects: [
          { type: 'flat', stat: 'reputation', value: -8 },
          { type: 'flat', stat: 'technicalDebt', value: -10 },
        ],
        logMessage: 'You fixed the bug. The power users filed three tickets. The codebase is cleaner.',
      },
      {
        label: 'Premium-gate it',
        description: 'The accidental behavior becomes a paid feature.',
        effects: [
          { type: 'flat', stat: 'cash', value: 500 },
          { type: 'flat', stat: 'reputation', value: -5 },
        ],
        logMessage: 'You paywalled the bug. Revenue is up. The developer community has opinions.',
      },
    ],
    tags: ['product', 'bugs', 'monetization'],
  },
  {
    id: 'discord-oracle',
    title: 'The Discord Oracle',
    category: 'easter-egg',
    description: 'A random user in your support Discord sent a message with a product suggestion that is unreasonably good. Better than anything in your current roadmap.',
    weight: 3,
    cooldown: 400,
    minRunTick: 50,
    choices: [
      {
        label: 'Listen and prioritize',
        description: 'Reprioritize based on the insight. This will cost focus.',
        effects: [
          { type: 'flat', stat: 'focus', value: -8 },
          { type: 'flat', stat: 'qualityMultiplier', value: 0.10 },
          { type: 'flat', stat: 'directMonetization', value: 0.12 },
        ],
        logMessage: 'You shipped the oracle\'s idea. It worked. Nobody will believe the origin story.',
      },
      {
        label: 'Partial adoption',
        description: 'Take the insight, adapt it to what you already have.',
        effects: [
          { type: 'flat', stat: 'qualityMultiplier', value: 0.05 },
          { type: 'flat', stat: 'reputation', value: 5 },
        ],
        logMessage: 'You borrowed the idea and shipped it slightly wrong. Still good.',
      },
      {
        label: 'Dismiss it',
        description: 'Stick to the plan.',
        effects: [
          { type: 'flat', stat: 'focus', value: 3 },
        ],
        logMessage: 'You dismissed the suggestion. The oracle has not posted since.',
      },
    ],
    tags: ['community', 'product', 'serendipity'],
  },
  {
    id: 'infra-coupon-found',
    title: 'Infra Coupon Found',
    category: 'easter-egg',
    description: 'Buried in an old email thread from a conference: a still-valid infrastructure credit worth more than you expected.',
    weight: 3,
    cooldown: 500,
    minRunTick: 20,
    choices: [
      {
        label: 'Bank it — reduce burn',
        description: 'Apply it to current costs. Sustainable.',
        effects: [
          { type: 'flat', stat: 'burnRate', value: -20 },
          { type: 'flat', stat: 'cash', value: 200 },
        ],
        logMessage: 'Credit applied. Burn drops. You screenshot it for the lore.',
      },
      {
        label: 'Scale aggressively',
        description: 'Use the credit to try something larger.',
        effects: [
          { type: 'flat', stat: 'compute', value: 25 },
          { type: 'flat', stat: 'technicalDebt', value: 8 },
        ],
        logMessage: 'You provisioned more compute than you needed. The experiment is running. You are curious.',
      },
      {
        label: 'Run experiments with it',
        description: 'Burn it on testing a risky idea.',
        effects: [
          { type: 'flat', stat: 'qualityMultiplier', value: 0.12 },
          { type: 'flat', stat: 'ideaProgress', value: 0.10 },
        ],
        logMessage: 'The experiment paid off. You learned something that would have taken weeks otherwise.',
      },
    ],
    tags: ['infra', 'bonus', 'lucky'],
  },
];
