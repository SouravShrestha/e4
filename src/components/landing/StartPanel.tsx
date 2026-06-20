"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { KingIcon } from "@/components/icons/KingIcon";
import { ShuffleIcon } from "@/components/icons/ShuffleIcon";

type SideChoice = "w" | "b" | "random";

const SIDES: Array<{ value: SideChoice; label: string; glyph: ReactNode }> = [
  {
    value: "w",
    label: "White",
    glyph: (
      <KingIcon
        width={32}
        height={32}
        pieceBorder="var(--piece-border-white)"
        pieceFill="var(--piece-fill-white)"
      />
    ),
  },
  {
    value: "random",
    label: "Random",
    glyph: <ShuffleIcon width={24} height={24} />,
  },
  {
    value: "b",
    label: "Black",
    glyph: (
      <KingIcon
        width={32}
        height={32}
        pieceBorder="var(--piece-border-black)"
        pieceFill="var(--piece-fill-black)"
      />
    ),
  },
];

export function StartPanel() {
  const router = useRouter();
  const [side, setSide] = useState<SideChoice>("w");
  const [starting, setStarting] = useState(false);

  function start() {
    setStarting(true);
    const resolved =
      side === "random" ? (Math.random() < 0.5 ? "w" : "b") : side;
    // Suggestions are on by default; the home-screen toggle is hidden.
    router.push(`/play?side=${resolved}&hints=1`);
  }

  return (
    <div>
      <div className="rounded-md">
        <div className="grid grid-cols-3 gap-6">
          {SIDES.map((option) => {
            const active = side === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSide(option.value)}
                className="flex flex-col items-center gap-1.5 rounded-xl border py-3 px-3 text-sm transition tracking-wide"
                style={{
                  borderColor: "transparent",
                  backgroundColor: active
                    ? "var(--accent-soft)"
                    : "transparent",
                  color: active ? "var(--foreground)" : "var(--muted)",
                  fontFamily: "var(--font-uber-move-medium)",
                }}
              >
                <span className="flex items-center justify-center h-8 w-8 mb-1">
                  {option.glyph}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={start}
        disabled={starting}
        className="w-full rounded-lg py-3.5 text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 mt-5 tracking-wide"
        style={{
          backgroundColor: "var(--play-button)",
          color: "var(--play-button-text)",
          fontFamily: "var(--font-uber-move)",
        }}
      >
        {starting ? "Loading" : "Start"}
      </button>
    </div>
  );
}
