export type Difficulty = {
  /** Difficulty level shown in the UI (1–5). */
  level: number;
};

export const LEVEL_MIN = 1;
export const LEVEL_MAX = 5;
export const DEFAULT_LEVEL = 2;

export const DEFAULT_DIFFICULTY: Difficulty = { level: DEFAULT_LEVEL };

export const clampLevel = (n: number) =>
  Math.min(LEVEL_MAX, Math.max(LEVEL_MIN, Math.round(n)));

/**
 * Engine search depth for a difficulty level — steps of 3 plies starting at 6,
 * so the levels span genuinely useful strength (L1 = depth 6 … L5 = depth 18)
 * rather than the near-instant, near-random depths 1–5.
 */
export const depthForLevel = (level: number) => 6 + (clampLevel(level) - 1) * 3;
