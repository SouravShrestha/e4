"use client";

type Props = {
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  winner: "White" | "Black" | null;
  onReset: () => void;
};

export function GameOverOverlay({ isCheckmate, isStalemate, isDraw, winner, onReset }: Props) {
  const title = isCheckmate ? "Checkmate!" : isStalemate ? "Stalemate!" : isDraw ? "Draw!" : "Game Over";

  const subtitle = isCheckmate
    ? `${winner} wins`
    : isStalemate
      ? "No legal moves — it's a draw"
      : isDraw
        ? "The game is a draw"
        : "";

  const icon = isCheckmate ? (winner === "White" ? "♔" : "♚") : "½";

  return (
    <div className="game-over-overlay">
      <div className="flex flex-col items-center gap-5 px-8 text-center" style={{ animation: "slide-up 0.3s ease forwards" }}>
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border-emphasis)",
          }}
        >
          <span className="text-4xl leading-none">{icon}</span>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {subtitle}
            </p>
          )}
        </div>

        <button
          onClick={onReset}
          className="mt-2 rounded-xl px-8 py-3 text-sm font-semibold transition-all duration-150 hover:opacity-80 active:scale-95"
          style={{
            backgroundColor: "var(--surface)",
            color: "var(--foreground)",
            border: "1px solid var(--border-emphasis)",
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
