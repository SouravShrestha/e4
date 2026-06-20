"use client";

import { useCallback, useState } from "react";
import type { Square } from "chess.js";
import type { useChessGame } from "@/hooks/useChessGame";
import { moveOptionStyles } from "@/lib/moveOptions";

type Game = ReturnType<typeof useChessGame>;
type SquareArg = string | null | undefined;

function toSquare(arg: SquareArg): Square | null {
  return arg ? (arg as Square) : null;
}

/**
 * Click / tap to move. Encapsulates the "selected square + highlighted
 * destinations" interaction so the board component stays declarative.
 *
 * Works for both mouse clicks and touch taps because react-chessboard fires
 * `onSquareClick` on tap-end — this is the piece that was missing on mobile.
 */
export function useBoardSelection(game: Game) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<
    Record<string, React.CSSProperties>
  >({});

  const clear = useCallback(() => {
    setSelectedSquare(null);
    setOptionSquares({});
  }, []);

  const select = useCallback(
    (square: Square) => {
      const piece = game.game.get(square);
      if (piece && piece.color === game.currentTurn) {
        setSelectedSquare(square);
        setOptionSquares(moveOptionStyles(game.game, square));
      } else {
        clear();
      }
    },
    [game, clear]
  );

  const handleSquareClick = useCallback(
    (arg: SquareArg) => {
      const square = toSquare(arg);
      if (!square || game.isGameOver) return;

      if (selectedSquare) {
        const move = game.game
          .moves({ square: selectedSquare, verbose: true })
          .find((m) => m.to === square);
        if (move) {
          const ok = game.makeMove({
            from: selectedSquare,
            to: square,
            promotion: move.promotion ? "q" : undefined
          });
          if (ok) {
            clear();
            return;
          }
        }
        if (square === selectedSquare) {
          clear();
          return;
        }
      }

      select(square);
    },
    [game, selectedSquare, select, clear]
  );

  return { selectedSquare, optionSquares, handleSquareClick, clearSelection: clear };
}
