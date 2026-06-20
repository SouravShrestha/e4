/** Helpers for the UCI move strings the engine emits (e.g. "e2e4", "e7e8q"). */

export function uciToSquares(uci: string | null) {
  if (!uci || uci.length < 4) return null;
  return { from: uci.slice(0, 2), to: uci.slice(2, 4) };
}

export function uciToArrow(uci: string | null): string | null {
  if (!uci || uci.length < 4) return null;
  return `${uci.slice(0, 2)} → ${uci.slice(2, 4)}`;
}
