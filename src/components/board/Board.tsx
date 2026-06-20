"use client";

import { useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import type { ChessboardOptions } from "react-chessboard";
import type { Square } from "chess.js";
import { cutePieces } from "@/components/board/pieces";
import { GameOverOverlay } from "@/components/game/GameOverOverlay";
import type {
  GameOverInfo,
  HistoryMove,
  MoveInput,
  PlayerSide,
} from "@/hooks/useChessGame";

type SquareArg = string | null | undefined;

type Props = {
  fen: string;
  playerSide: PlayerSide;
  lastMove: HistoryMove | null;
  hintSquares: { from: string; to: string } | null;
  hintActive: boolean;
  hintIsCapture: boolean;
  isGameOver: boolean;
  gameOverInfo: GameOverInfo | null;
  optionSquares: Record<string, React.CSSProperties>;
  onMove: (input: MoveInput) => boolean;
  onReset: () => void;
  onSquareClick: (arg: SquareArg) => void;
};

// Arrows are drawn by react-chessboard as SVG attributes, where `var(--token)`
// does not resolve — so we read the concrete colours from the theme tokens and
// re-read them whenever the theme (the <html> class) changes.
const ARROW_TOKENS = {
  primary: { token: "--arrow-primary", fallback: "#FFAA00" },
  secondary: { token: "--arrow-secondary", fallback: "#4CAF50" },
  tertiary: { token: "--arrow-tertiary", fallback: "#F44336" },
  hint: { token: "--hint-arrow", fallback: "#C6D5E0" },
  hintCapture: { token: "--hint-capture-arrow", fallback: "#F87171E6" },
} as const;

type ArrowKey = keyof typeof ARROW_TOKENS;
type ArrowColors = Record<ArrowKey, string>;

const ARROW_FALLBACKS = (Object.keys(ARROW_TOKENS) as ArrowKey[]).reduce(
  (acc, key) => {
    acc[key] = ARROW_TOKENS[key].fallback;
    return acc;
  },
  {} as ArrowColors,
);

function readArrowColors(): ArrowColors {
  const styles = getComputedStyle(document.documentElement);
  const result = {} as ArrowColors;
  for (const key of Object.keys(ARROW_TOKENS) as ArrowKey[]) {
    const { token, fallback } = ARROW_TOKENS[key];
    result[key] = styles.getPropertyValue(token).trim() || fallback;
  }
  return result;
}

function useArrowColors() {
  const [colors, setColors] = useState<ArrowColors>(ARROW_FALLBACKS);
  useEffect(() => {
    const read = () => setColors(readArrowColors());
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return colors;
}

export function Board({
  fen,
  playerSide,
  lastMove,
  hintSquares,
  hintActive,
  hintIsCapture,
  isGameOver,
  gameOverInfo,
  optionSquares,
  onMove,
  onReset,
  onSquareClick,
}: Props) {
  const arrowColors = useArrowColors();

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (lastMove) {
      const highlight: React.CSSProperties = {
        background: "var(--square-last-move)",
      };
      styles[lastMove.from] = highlight;
      styles[lastMove.to] = highlight;
    }
    if (hintActive && hintSquares) {
      styles[hintSquares.from] = {
        background: "var(--hint-fill)",
        boxShadow: "inset 0 0 0 2px var(--hint-ring)",
      };
    }
    return { ...styles, ...optionSquares };
  }, [lastMove, hintActive, hintSquares, optionSquares]);

  const boardOptions = useMemo<ChessboardOptions>(
    () => ({
      id: "e4-board",
      position: fen,
      boardOrientation: playerSide === "w" ? "white" : "black",
      squareStyles,
      pieces: cutePieces,
      allowDragging: false,
      showAnimations: true,
      animationDurationInMs: 200,
      onPieceDrop: ({ piece, sourceSquare, targetSquare }) => {
        if (isGameOver || !targetSquare) return false;
        const isPromotion =
          piece.pieceType.toLowerCase().endsWith("p") &&
          ((piece.pieceType.startsWith("w") && targetSquare[1] === "8") ||
            (piece.pieceType.startsWith("b") && targetSquare[1] === "1"));
        return onMove({
          from: sourceSquare as Square,
          to: targetSquare as Square,
          promotion: isPromotion ? "q" : undefined,
        });
      },
      boardStyle: { borderRadius: 0 },
      darkSquareStyle: { backgroundColor: "var(--board-dark)" },
      lightSquareStyle: { backgroundColor: "var(--board-light)" },
      showNotation: false,
      allowDrawingArrows: true,
      clearArrowsOnClick: false,
      arrowOptions: {
        color: arrowColors.primary,
        secondaryColor: arrowColors.secondary,
        tertiaryColor: arrowColors.tertiary,
        arrowLengthReducerDenominator: 8,
        sameTargetArrowLengthReducerDenominator: 4,
        arrowWidthDenominator: 5,
        activeArrowWidthMultiplier: 0.9,
        opacity: 0.7,
        activeOpacity: 0.5,
        arrowStartOffset: 0.4,
      },
      arrows:
        hintActive && hintSquares
          ? [
              {
                startSquare: hintSquares.from as Square,
                endSquare: hintSquares.to as Square,
                color: hintIsCapture
                  ? arrowColors.hintCapture
                  : arrowColors.hint,
              },
            ]
          : [],
      // Only onSquareClick — it fires for taps on pieces and empty squares
      // alike (and on touch via the library's touch-end handler). Wiring
      // onPieceClick too would double-fire and instantly deselect.
      onSquareClick: ({ square }) => onSquareClick(square),
    }),
    [
      fen,
      playerSide,
      squareStyles,
      isGameOver,
      onMove,
      onSquareClick,
      hintActive,
      hintSquares,
      hintIsCapture,
      arrowColors,
    ],
  );

  const ranks =
    playerSide === "w"
      ? ["8", "7", "6", "5", "4", "3", "2", "1"]
      : ["1", "2", "3", "4", "5", "6", "7", "8"];
  const files =
    playerSide === "w"
      ? ["a", "b", "c", "d", "e", "f", "g", "h"]
      : ["h", "g", "f", "e", "d", "c", "b", "a"];

  return (
    <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
      <Chessboard options={boardOptions} />

      {/* Custom coordinate notation */}
      <div className="pointer-events-none absolute inset-0">
        {ranks.map((r, i) => (
          <div
            key={r}
            className="absolute left-[3px] flex items-start justify-start"
            style={{ top: `${i * 12.8}%`, height: "12.5%", width: "12.5%" }}
          >
            <span
              className="text-[10px] font-medium"
              style={{ color: "var(--board-coordinate)" }}
            >
              {r}
            </span>
          </div>
        ))}
        {files.map((f, i) => (
          <div
            key={f}
            className="absolute bottom-0 flex items-end justify-end pb-[1.5px] pr-[1px] sm:pb-[3px] sm:pr-[3px]"
            style={{ left: `${i * 12.4}%`, width: "12.5%", height: "12.5%" }}
          >
            <span
              className="text-[10px] font-medium"
              style={{ color: "var(--board-coordinate)" }}
            >
              {f}
            </span>
          </div>
        ))}
      </div>

      {isGameOver && gameOverInfo && (
        <GameOverOverlay
          isCheckmate={gameOverInfo.isCheckmate}
          isStalemate={gameOverInfo.isStalemate}
          isDraw={gameOverInfo.isDraw}
          winner={gameOverInfo.winner}
          onReset={onReset}
        />
      )}
    </div>
  );
}
