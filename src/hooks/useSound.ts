"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SoundEvent =
  | "move"
  | "capture"
  | "castle"
  | "check"
  | "promote"
  | "game-end"
  | "notify";

const SOUND_MAP: Record<SoundEvent, string> = {
  move: "/audio/move-self.mp3",
  capture: "/audio/capture.mp3",
  castle: "/audio/castle.mp3",
  check: "/audio/move-check.mp3",
  promote: "/audio/promote.mp3",
  "game-end": "/audio/game-end.mp3",
  notify: "/audio/notify.mp3",
};

const STORAGE_KEY = "e4:sound-enabled";

export function useSound() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });

  const audioCache = useRef<Map<SoundEvent, HTMLAudioElement>>(new Map());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  const play = useCallback(
    (event: SoundEvent) => {
      if (!enabled) return;

      let audio = audioCache.current.get(event);
      if (!audio) {
        audio = new Audio(SOUND_MAP[event]);
        audioCache.current.set(event, audio);
      }

      audio.currentTime = 0;
      audio.play().catch(() => {
        // Autoplay policy may block it; ignore silently
      });
    },
    [enabled]
  );

  const toggle = useCallback(() => setEnabled((v) => !v), []);

  return { enabled, toggle, play };
}
