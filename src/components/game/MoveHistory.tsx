"use client";

import { Fragment, useEffect, useRef } from "react";
import type { HistoryMove } from "@/hooks/useChessGame";

type Props = {
  moves: HistoryMove[];
  currentPly: number;
  onGoToPly: (ply: number) => void;
  onStart: () => void;
  onPrev: () => void;
  onNext: () => void;
  onEnd: () => void;
  /**
   * "strip" — horizontal two-row chips (compact, used under the board on
   * small screens). "list" — vertical move table (number · white · black),
   * scrollable, used in the desktop sidebar.
   */
  variant?: "strip" | "list";
};

export function MoveHistory({
  moves,
  currentPly,
  onGoToPly,
  variant = "strip",
}: Props) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      block: "end",
      inline: "nearest",
      behavior: "smooth",
    });
  }, [currentPly]);

  if (variant === "list") {
    const rows = Math.ceil(moves.length / 2);

    const cell = (move: HistoryMove | undefined, ply: number) => {
      if (!move) return <div />;
      const isActive = currentPly === ply;
      return (
        <button
          ref={isActive ? activeRef : undefined}
          onClick={() => onGoToPly(ply)}
          className="rounded-md px-2 py-1.5 text-left text-sm font-mono font-medium transition-colors hover:bg-surface-muted"
          style={
            isActive
              ? {
                  backgroundColor: "var(--surface)",
                  color: "var(--foreground)",
                }
              : { color: "var(--faint)" }
          }
        >
          {move.san}
        </button>
      );
    };

    return (
      <div className="h-full overflow-y-auto move-chips-scroll pr-1">
        <div
          className="grid items-start gap-x-2 gap-y-4 content-start"
          style={{ gridTemplateColumns: "1.75rem 1fr 1fr" }}
        >
          {Array.from({ length: rows }, (_, r) => (
            <Fragment key={r}>
              <div
                className="select-none pr-1 text-right text-xs font-mono mt-2"
                style={{ color: "var(--muted)" }}
              >
                {r + 1}.
              </div>
              {cell(moves[2 * r], 2 * r + 1)}
              {cell(moves[2 * r + 1], 2 * r + 2)}
            </Fragment>
          ))}
        </div>
      </div>
    );
  }

  // ── strip variant: horizontal two-row chips ──
  const whiteMoves = moves
    .map((move, i) => ({ move, ply: i + 1 }))
    .filter((_, i) => i % 2 === 0);
  const blackMoves = moves
    .map((move, i) => ({ move, ply: i + 1 }))
    .filter((_, i) => i % 2 !== 0);

  const whiteItems =
    whiteMoves.length > 0 ? whiteMoves : [{ ply: 1, isDummy: true }];
  const blackItems =
    blackMoves.length > 0 ? blackMoves : [{ ply: 2, isDummy: true }];

  const renderMove = (
    data: {
      move?: HistoryMove;
      ply: number;
      isDummy?: boolean;
    },
    index: number,
    arr: any[],
  ) => {
    const { move, ply, isDummy } = data;
    const isLast = index === arr.length - 1;
    const isActive = !isDummy && currentPly === ply;
    return (
      <button
        key={ply}
        ref={isActive ? activeRef : undefined}
        onClick={() => !isDummy && onGoToPly(ply)}
        className={`ml-4 ${isLast ? "mr-4" : "-mr-1"} w-14 flex-shrink-0 rounded-md py-1.5 text-center text-sm font-mono font-medium transition-all duration-150 ${isDummy ? "cursor-default" : ""}`}
        style={
          isActive
            ? {
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
                border: "1px solid var(--divider)",
              }
            : {
                backgroundColor: "transparent",
                color: "var(--faint)",
                border: "1px solid var(--divider)",
              }
        }
      >
        {isDummy ? "-" : move?.san}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2 overflow-x-auto pb-2 move-chips-scroll">
      <div className="flex w-max mb-1">{whiteItems.map(renderMove)}</div>
      <div className="flex w-max">{blackItems.map(renderMove)}</div>
    </div>
  );
}
