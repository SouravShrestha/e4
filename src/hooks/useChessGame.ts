"use client";

import { useCallback, useMemo, useState } from "react";
import type { Square } from "chess.js";
import { createChess, isValidFen, STARTING_FEN } from "@/lib/chess";

export type PlayerSide = "w" | "b";

export type HistoryMove = {
  san: string;
  from: string;
  to: string;
  color: PlayerSide;
};

export type GameOverInfo = {
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  winner: "White" | "Black" | null;
};

export type MoveInput = { from: string; to: string; promotion?: string };

function describeGameOver(game: ReturnType<typeof createChess>): GameOverInfo | null {
  if (!game.isGameOver()) return null;
  if (game.isCheckmate()) {
    const winner = game.turn() === "w" ? "Black" : "White";
    return { isCheckmate: true, isStalemate: false, isDraw: false, winner };
  }
  if (game.isStalemate()) {
    return { isCheckmate: false, isStalemate: true, isDraw: false, winner: null };
  }
  return { isCheckmate: false, isStalemate: false, isDraw: true, winner: null };
}

/**
 * Owns the chess position, the full move list, and a navigable ply cursor.
 *
 * The cursor (`currentPly`) lets the user scrub through history; making a move
 * while viewing the past truncates the future and starts a new line — the
 * standard behaviour of an analysis board.
 */
export function useChessGame(initialSide: PlayerSide = "w") {
  const [startFen, setStartFen] = useState(STARTING_FEN);
  const [moves, setMoves] = useState<HistoryMove[]>([]);
  const [currentPly, setCurrentPly] = useState(0);
  const [playerSide, setPlayerSide] = useState<PlayerSide>(initialSide);

  // The position shown on the board is `startFen` replayed up to `currentPly`.
  const game = useMemo(() => {
    const chess = createChess(startFen);
    for (let i = 0; i < currentPly && i < moves.length; i += 1) {
      const m = moves[i];
      chess.move({ from: m.from as Square, to: m.to as Square, promotion: "q" });
    }
    return chess;
  }, [startFen, moves, currentPly]);

  const fen = useMemo(() => game.fen(), [game]);
  const currentTurn = game.turn() as PlayerSide;
  const isLatest = currentPly === moves.length;
  const gameOverInfo = isLatest ? describeGameOver(game) : null;

  const lastMove = useMemo(
    () => (currentPly > 0 ? moves[currentPly - 1] : null),
    [moves, currentPly]
  );

  const makeMove = useCallback(
    (input: MoveInput) => {
      const chess = createChess(startFen);
      for (let i = 0; i < currentPly; i += 1) {
        const m = moves[i];
        chess.move({ from: m.from as Square, to: m.to as Square, promotion: "q" });
      }

      const result = chess.move({
        from: input.from as Square,
        to: input.to as Square,
        promotion: input.promotion
      });
      if (!result) return false;

      const entry: HistoryMove = {
        san: result.san,
        from: result.from,
        to: result.to,
        color: result.color as PlayerSide
      };

      setMoves((prev) => [...prev.slice(0, currentPly), entry]);
      setCurrentPly(currentPly + 1);
      return true;
    },
    [startFen, moves, currentPly]
  );

  const goToPly = useCallback(
    (ply: number) => setCurrentPly(Math.max(0, Math.min(ply, moves.length))),
    [moves.length]
  );
  const goToStart = useCallback(() => setCurrentPly(0), []);
  const goToEnd = useCallback(() => setCurrentPly(moves.length), [moves.length]);
  const goPrev = useCallback(() => setCurrentPly((p) => Math.max(0, p - 1)), []);
  const goNext = useCallback(
    () => setCurrentPly((p) => Math.min(moves.length, p + 1)),
    [moves.length]
  );

  const reset = useCallback(() => {
    setStartFen(STARTING_FEN);
    setMoves([]);
    setCurrentPly(0);
  }, []);

  const loadFen = useCallback((candidate: string) => {
    const trimmed = candidate.trim();
    if (!isValidFen(trimmed)) return false;
    setStartFen(trimmed);
    setMoves([]);
    setCurrentPly(0);
    return true;
  }, []);

  const changeSide = useCallback(
    (side: PlayerSide) => {
      setPlayerSide(side);
      reset();
    },
    [reset]
  );

  // Flip the side you control without disturbing the current position — used
  // by the in-game "Switch sides" action (just re-orients and re-targets hints).
  const flipSide = useCallback(() => {
    setPlayerSide((s) => (s === "w" ? "b" : "w"));
  }, []);

  return {
    game,
    fen,
    startFen,
    moves,
    currentPly,
    playerSide,
    currentTurn,
    isLatest,
    lastMove,
    gameOverInfo,
    isGameOver: !!gameOverInfo,
    makeMove,
    goToPly,
    goToStart,
    goToEnd,
    goPrev,
    goNext,
    reset,
    loadFen,
    changeSide,
    flipSide
  };
}
