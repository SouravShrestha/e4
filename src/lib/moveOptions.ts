import type { Chess, Square } from "chess.js";

const MOVE_DOT =
  "radial-gradient(circle, var(--move-dot) 25%, transparent 26%)";
const CAPTURE_RING =
  "radial-gradient(circle, transparent 0%, transparent 79%, var(--capture-ring) 80%, var(--capture-ring) 100%)";

/**
 * Build the square-style overlay that shows the legal destinations for the
 * piece on `square`: a dot on empty targets, a ring on captures, and a subtle
 * tint on the origin square itself.
 */
export function moveOptionStyles(
  game: Chess,
  square: Square
): Record<string, React.CSSProperties> {
  const moves = game.moves({ square, verbose: true });
  if (moves.length === 0) return {};

  const origin = game.get(square);
  const styles: Record<string, React.CSSProperties> = {};

  for (const move of moves) {
    const target = game.get(move.to as Square);
    const isCapture = !!target && target.color !== origin?.color;
    styles[move.to] = {
      background: isCapture ? CAPTURE_RING : MOVE_DOT,
      borderRadius: "50%"
    };
  }

  styles[square] = { background: "var(--square-selected)" };
  return styles;
}
