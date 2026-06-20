"use client";

import { useEffect, useRef } from "react";
import type { Chess } from "chess.js";
import type { HistoryMove } from "@/hooks/useChessGame";
import type { SoundEvent } from "@/hooks/useSound";

type MoveSoundsState = {
  currentPly: number;
  moves: HistoryMove[];
  isGameOver: boolean;
  game: Chess;
};

/** Plays a sound effect whenever a brand-new move lands at the tip of the game. */
export function useMoveSounds(
  state: MoveSoundsState,
  play: (event: SoundEvent) => void,
) {
  const prevMovesLenRef = useRef(state.moves.length);

  useEffect(() => {
    const newLen = state.moves.length;
    const prevLen = prevMovesLenRef.current;
    prevMovesLenRef.current = newLen;

    // Only fire on a genuinely new move at the tip (not history navigation).
    if (newLen <= prevLen || state.currentPly !== newLen) return;

    const lastMove = state.moves[newLen - 1];
    if (!lastMove) return;

    if (state.isGameOver) play("game-end");
    else if (state.game.inCheck()) play("check");
    else if (lastMove.san.includes("O")) play("castle");
    else if (lastMove.san.includes("=")) play("promote");
    else if (lastMove.san.includes("x")) play("capture");
    else play("move");
  }, [state.currentPly, state.moves, state.isGameOver, state.game, play]);
}
