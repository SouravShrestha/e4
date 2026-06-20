"use client";

import { ChevronLeftIcon } from "@/components/icons";
import { THEMES } from "@/lib/themes";

type Props = {
  currentTheme: string;
  onSelect: (themeId: string) => void;
  onBack: () => void;
};

export function ThemePanel({ currentTheme, onSelect, onBack }: Props) {
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
      {THEMES.map((theme) => {
        const active = currentTheme === theme.id;
        return (
          <button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition hover:bg-surface-muted"
            style={{
              color: active ? "var(--accent)" : "var(--foreground)",
              backgroundColor: active ? "var(--accent-soft)" : "transparent",
            }}
          >
            {theme.name}
            {active && <span className="text-xs">✓</span>}
          </button>
        );
      })}
    </div>
  );
}
