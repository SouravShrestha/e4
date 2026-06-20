"use client";

import { UndoIcon } from "@/components/icons/UndoIcon";
import { RedoIcon } from "@/components/icons/RedoIcon";

type Props = {
  bestMove: string | null;
  awaitingOpponent?: boolean;
  isAnalyzing: boolean;
  error: string | null;
  suggestionsPaused: boolean;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

function NavButton({
  icon: Icon,
  alt,
  disabled,
  onClick,
  color,
}: {
  icon: React.ElementType;
  alt: string;
  disabled: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={alt}
      className={`flex size-[52px] items-center justify-center rounded-md border border-divider bg-surface transition-opacity disabled:opacity-30 ${
        color ? "" : "text-[var(--faint)] hover:text-[var(--foreground)]"
      }`}
      style={color ? { color } : undefined}
    >
      <Icon width={22} height={22} color={color} style={{ opacity: 0.85 }} />
    </button>
  );
}

export function BestMoveBar({
  bestMove,
  awaitingOpponent = false,
  isAnalyzing,
  error,
  suggestionsPaused,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: Props) {
  const label = error
    ? "Engine unavailable"
    : suggestionsPaused
      ? "Suggestions Paused"
      : awaitingOpponent
        ? "Opponent to move"
        : "Best Move";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4 px-4 py-4">
        <NavButton
          icon={UndoIcon}
          alt="Previous move"
          disabled={!canPrev}
          onClick={onPrev}
          color={canPrev ? "var(--foreground)" : "var(--disabled)"}
        />

        <div className="flex flex-1 flex-col items-center gap-1">
          <p
            className="text-xs font-medium tracking-widest"
            title={error ?? undefined}
            style={{
              color: error ? "var(--danger)" : "var(--faint)",
            }}
          >
            {label}
          </p>
          <div
            className="flex h-7 items-center justify-center font-mono text-xl font-medium tracking-wider"
            style={{ color: "var(--foreground)" }}
          >
            {error || suggestionsPaused ? (
              <span style={{ color: "var(--faint)" }}>—</span>
            ) : bestMove ? (
              bestMove
            ) : isAnalyzing ? (
              <div className="loader opacity-80" />
            ) : (
              <span style={{ color: "var(--faint)" }}>—</span>
            )}
          </div>
        </div>

        <NavButton
          icon={RedoIcon}
          alt="Next move"
          disabled={!canNext}
          onClick={onNext}
          color={canNext ? "var(--foreground)" : "var(--disabled)"}
        />
      </div>
    </div>
  );
}
