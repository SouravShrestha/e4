"use client";

import { ChevronLeftIcon } from "@/components/icons";
import {
  clampLevel,
  depthForLevel,
  LEVEL_MAX,
  LEVEL_MIN,
  type Difficulty,
} from "@/lib/difficulty";

type Props = {
  difficulty: Difficulty;
  onChange: (patch: Partial<Difficulty>) => void;
  onBack: () => void;
};

const LEVELS = Array.from(
  { length: LEVEL_MAX - LEVEL_MIN + 1 },
  (_, i) => LEVEL_MIN + i,
);

export function DifficultyPanel({ difficulty, onChange, onBack }: Props) {
  return (
    <div className="flex flex-col">
      <button
        onClick={onBack}
        className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium transition hover:bg-surface-muted"
        style={{ color: "var(--muted)" }}
      >
        <ChevronLeftIcon size={16} />
        Back
      </button>
      <div className="my-1 border-t border-divider" />

      <div className="px-2 pb-2 pt-1">
        <div
          className="mb-2 px-1 text-xs font-medium"
          style={{ color: "var(--muted)" }}
        >
          Difficulty level
        </div>
        <select
          value={clampLevel(difficulty.level)}
          onChange={(e) => onChange({ level: Number(e.target.value) })}
          aria-label="Difficulty level"
          className="w-full cursor-pointer rounded-lg border border-divider px-3 py-2 text-sm font-medium outline-none focus:border-divider-strong"
          style={{
            backgroundColor: "var(--element-background)",
            color: "var(--foreground)",
          }}
        >
          {LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              Level {lvl} - Depth {depthForLevel(lvl)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
