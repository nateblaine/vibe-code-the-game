# Vibe Code: The Video Game

A browser-based startup management game built with React, TypeScript, Vite, and Zustand.

You pick a persona, starter tool, and seed skills, choose a first idea, then try to survive the event loop long enough to turn launched products into enough cash and lifetime earnings to reach a `$1,000,000` win score.

## Current Status

The project is in a strong prototype state.

Implemented now:

- title screen and multi-step run setup flow
- selectable personas, tools, skills, and first idea
- real-time tick simulation with pause and auto-save
- idea progression from concept to plateau
- event system with modal choices, event timing, and optional auto-triage
- upgrade system with readable effect descriptions
- run clock, event-loop HUD, and `$1M` progress bar
- in-game guide / glossary with optional tooltips
- end-run summary screen with win and loss conditions
- manual production deployment path to `https://nateblaine.com/vibe-code-the-game`

Still prototype-level:

- no automated test suite yet
- balance is still being tuned by playtesting
- some content breadth is intentionally narrow for now

## Win / Loss Model

The current win score is:

- `cash + totalEarned + valuationBonus`

You win when that score reaches `$1,000,000`.

You currently lose if:

- cash reaches `0` or below
- reputation reaches `-20`
- focus reaches `0`

## Core Gameplay Loop

1. Start a new run and choose your build.
2. Allocate agent capacity to your idea.
3. Push the idea through `concept -> prototype -> launch -> growth -> scale -> plateau`.
4. Once an idea launches, its stored revenue starts converting into `Income / tick`.
5. Keep `Net / tick` positive by growing income faster than burn.
6. Buy upgrades, survive events, and keep focus / reputation / debt under control.
7. Reach the `$1M` score threshold before the run collapses.

## Economy Notes

The game standardizes the live economy around `tick`.

- `Burn / tick` is cash spent each simulation tick
- `Income / tick` is cash earned each simulation tick from launched ideas
- `Net / tick` is income minus burn

The run clock is still shown as in-world time:

- `6 ticks = 1 in-game hour`

## Project Structure

High-value files:

- [src/App.tsx](src/App.tsx): top-level screen switcher
- [src/hooks/useGameStore.ts](src/hooks/useGameStore.ts): Zustand store and UI/game orchestration
- [src/hooks/useGameLoop.ts](src/hooks/useGameLoop.ts): simulation loop integration
- [src/core/gameState.ts](src/core/gameState.ts): initial run state construction
- [src/core/simulation.ts](src/core/simulation.ts): per-tick simulation and event resolution
- [src/core/formulas.ts](src/core/formulas.ts): derived stats, burn, income, progression math
- [src/core/progression.ts](src/core/progression.ts): stage advancement and win/loss checks
- [src/core/eventEngine.ts](src/core/eventEngine.ts): event cadence and eligibility
- [src/components/screens/RunSetupScreen.tsx](src/components/screens/RunSetupScreen.tsx): new-run flow
- [src/components/screens/MainDashboard.tsx](src/components/screens/MainDashboard.tsx): main game UI
- [src/components/ui/TopBar.tsx](src/components/ui/TopBar.tsx): HUD and progress indicators
- [src/components/ui/StatReferencePanel.tsx](src/components/ui/StatReferencePanel.tsx): guide / glossary

Content lives in:

- `src/content/personas.ts`
- `src/content/starterTools.ts`
- `src/content/skills.ts`
- `src/content/ideas.ts`
- `src/content/upgrades.ts`
- `src/content/events.ts`

## Local Development

Requirements:

- Node.js `20+` recommended
- `npm`

Install and run:

```bash
npm install
npm run dev
```

Default local URL:

- `http://127.0.0.1:5173/`

Validation commands:

```bash
npm run build
npm run lint
```

## Save / Persistence

The game currently uses local browser persistence.

- saves are created automatically when a run starts
- the sim auto-saves every `30` ticks
- the Settings tab includes a manual save action
- abandoning a run clears the save and returns to the start flow

## Production Deploy

This repo does not deploy itself directly to production.

Current production publishing works by building this Vite app and syncing the output into the `nate-gpt` site repo under a dedicated public folder, then deploying that site.

Live URL:

- `https://nateblaine.com/vibe-code-the-game`

Important:

- this is a manual publish path, not an automatic deploy on every game change
- the detailed deployment workflow is documented in the `nate-gpt` repo

## Recommended Next Work

Highest-value next steps:

- add automated tests for formulas, progression, and event cadence
- continue balance tuning around launch speed, burn, and upgrade pacing
- expand content variety for ideas, events, and upgrades
- add clearer late-game systems so the post-launch phase has more strategic depth

## License

No license file has been added yet.
