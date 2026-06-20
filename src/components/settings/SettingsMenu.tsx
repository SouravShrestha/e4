"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  FlipIcon,
  PauseIcon,
  PlayIcon,
  RestartIcon,
  ExitIcon,
  VolumeOnIcon,
  VolumeOffIcon,
  PaletteIcon,
  SettingsIcon,
  SlidersIcon,
  MoonIcon,
} from "@/components/icons";
import { applyTheme } from "@/lib/theme";
import type { Difficulty } from "@/lib/difficulty";
import { DifficultyPanel } from "./DifficultyPanel";
import { ThemePanel } from "./ThemePanel";

type Props = {
  isMainScreen?: boolean;
  suggestionsPaused?: boolean;
  soundEnabled?: boolean;
  difficulty?: Difficulty;
  onSwitchSides?: () => void;
  onToggleSuggestions?: () => void;
  onToggleSound?: () => void;
  onChangeDifficulty?: (patch: Partial<Difficulty>) => void;
  onRestart?: () => void;
  onExit?: () => void;
};

function MenuItem({
  icon,
  label,
  onClick,
  color = "var(--foreground)",
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition hover:bg-surface-muted"
      style={{ color }}
    >
      {icon}
      {label}
    </button>
  );
}

export function SettingsMenu({
  isMainScreen = false,
  suggestionsPaused = false,
  soundEnabled = true,
  difficulty,
  onSwitchSides,
  onToggleSuggestions,
  onToggleSound,
  onChangeDifficulty,
  onRestart,
  onExit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("default");
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentTheme(localStorage.getItem("app-theme") || "default");
    setMode((localStorage.getItem("app-mode") as "light" | "dark") || "dark");
  }, [open]);

  useEffect(() => {
    if (!open) {
      setShowThemes(false);
      setShowDifficulty(false);
      return;
    }
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleThemeSelect = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem("app-theme", themeId);
    applyTheme(themeId, mode);
    window.dispatchEvent(new Event("app-theme-changed"));
  };

  const toggleMode = () => {
    const nextMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
    localStorage.setItem("app-mode", nextMode);
    applyTheme(currentTheme, nextMode);
    window.dispatchEvent(new Event("app-theme-changed"));
  };

  const close = () => setOpen(false);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Settings"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex size-9 cursor-pointer items-center justify-center backdrop-blur transition hover:opacity-80 rounded-full border border-divider"
        style={{ backgroundColor: "var(--element-background)" }}
      >
        <SettingsIcon size={18} fill="var(--element-foreground)" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-md border border-divider-strong p-1.5 animate-fade-in"
          style={{ backgroundColor: "var(--element-background)" }}
        >
          {showDifficulty && difficulty && onChangeDifficulty ? (
            <DifficultyPanel
              difficulty={difficulty}
              onChange={onChangeDifficulty}
              onBack={() => setShowDifficulty(false)}
            />
          ) : showThemes ? (
            <ThemePanel
              currentTheme={currentTheme}
              onSelect={handleThemeSelect}
              onBack={() => setShowThemes(false)}
            />
          ) : (
            <div className="flex flex-col">
              {!isMainScreen && onSwitchSides && (
                <MenuItem
                  icon={<FlipIcon size={17} className="opacity-80" />}
                  label="Switch sides"
                  onClick={() => {
                    onSwitchSides();
                    close();
                  }}
                />
              )}

              {!isMainScreen && onToggleSuggestions && (
                <MenuItem
                  icon={
                    suggestionsPaused ? (
                      <PlayIcon size={17} className="opacity-80" />
                    ) : (
                      <PauseIcon size={17} className="opacity-80" />
                    )
                  }
                  label={
                    suggestionsPaused ? "Resume suggestions" : "Pause suggestions"
                  }
                  onClick={() => {
                    onToggleSuggestions();
                    close();
                  }}
                />
              )}

              {!isMainScreen && difficulty && onChangeDifficulty && (
                <MenuItem
                  icon={<SlidersIcon size={17} className="opacity-80" />}
                  label="Difficulty"
                  onClick={() => setShowDifficulty(true)}
                />
              )}

              {onToggleSound && (
                <MenuItem
                  icon={
                    soundEnabled ? (
                      <VolumeOnIcon size={17} className="opacity-80" />
                    ) : (
                      <VolumeOffIcon size={17} className="opacity-80" />
                    )
                  }
                  label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
                  onClick={onToggleSound}
                />
              )}

              {isMainScreen && (
                <MenuItem
                  icon={<PaletteIcon size={17} className="opacity-80" />}
                  label="Theme"
                  onClick={() => setShowThemes(true)}
                />
              )}

              {isMainScreen && (
                <label className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition hover:bg-surface-muted">
                  <div
                    className="flex items-center gap-3"
                    style={{ color: "var(--foreground)" }}
                  >
                    <MoonIcon
                      width={17}
                      height={17}
                      className="opacity-80 fill-current"
                    />
                    Dark mode
                  </div>
                  <div className="switch">
                    <input
                      type="checkbox"
                      checked={mode === "dark"}
                      onChange={toggleMode}
                    />
                    <span className="slider"></span>
                  </div>
                </label>
              )}

              {!isMainScreen && onRestart && (
                <MenuItem
                  icon={<RestartIcon size={17} className="opacity-80" />}
                  label="Restart"
                  onClick={() => {
                    onRestart();
                    close();
                  }}
                />
              )}

              {!isMainScreen && onExit && (
                <MenuItem
                  icon={<ExitIcon size={17} className="opacity-80" />}
                  label="Exit"
                  color="var(--danger)"
                  onClick={() => {
                    onExit();
                    close();
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
