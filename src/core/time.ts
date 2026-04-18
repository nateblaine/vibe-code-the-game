const TICKS_PER_HOUR = 6;
const START_HOUR = 8;

export interface WorldClock {
  day: number;
  hour: number;
  minute: number;
  phase: 'day' | 'night';
  label: string;
  ticksIntoHour: number;
  ticksPerHour: number;
}

export function getWorldClock(tickCount: number): WorldClock {
  const elapsedHours = Math.floor(tickCount / TICKS_PER_HOUR);
  const totalHours = START_HOUR + elapsedHours;
  const day = Math.floor(totalHours / 24) + 1;
  const hour = totalHours % 24;
  const ticksIntoHour = tickCount % TICKS_PER_HOUR;
  const minute = ticksIntoHour * (60 / TICKS_PER_HOUR);
  const phase = hour >= 6 && hour < 18 ? 'day' : 'night';

  return {
    day,
    hour,
    minute,
    phase,
    label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    ticksIntoHour,
    ticksPerHour: TICKS_PER_HOUR,
  };
}

export function formatTickCountdown(ticks: number): string {
  const safeTicks = Math.max(0, ticks);
  const minutes = Math.floor(safeTicks / 60);
  const seconds = safeTicks % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export { TICKS_PER_HOUR };
