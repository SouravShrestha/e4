"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_DIFFICULTY, clampLevel, type Difficulty } from "@/lib/difficulty";

const STORAGE_KEY = "e4:difficulty";

/** Persisted engine-difficulty setting (level 1–5). */
export function useDifficulty() {
  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    if (typeof window === "undefined") return DEFAULT_DIFFICULTY;
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      return typeof parsed?.level === "number"
        ? { level: clampLevel(parsed.level) }
        : DEFAULT_DIFFICULTY;
    } catch {
      return DEFAULT_DIFFICULTY;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(difficulty));
    } catch {
      // Ignore storage failures (private mode, quota, etc.)
    }
  }, [difficulty]);

  const update = useCallback((patch: Partial<Difficulty>) => {
    setDifficulty((prev) => ({ ...prev, ...patch }));
  }, []);

  return { difficulty, update };
}
