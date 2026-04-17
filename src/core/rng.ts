// Seeded PRNG (mulberry32) — deterministic, fast, good distribution for game use.

export type RNG = () => number;

export function createRng(seed: number): RNG {
  let s = seed >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let z = s;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

// Pick a random item from an array
export function pick<T>(rng: RNG, items: T[]): T {
  return items[Math.floor(rng() * items.length)];
}

// Weighted pick: items is [{item, weight}, ...]
export function weightedPick<T>(rng: RNG, items: { item: T; weight: number }[]): T | null {
  if (items.length === 0) return null;
  const total = items.reduce((sum, x) => sum + x.weight, 0);
  let threshold = rng() * total;
  for (const { item, weight } of items) {
    threshold -= weight;
    if (threshold <= 0) return item;
  }
  return items[items.length - 1].item;
}
