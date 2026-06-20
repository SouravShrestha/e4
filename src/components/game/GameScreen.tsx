"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Square } from "chess.js";
import {
  useChessGame,
  type PlayerSide,
  type MoveInput,
} from "@/hooks/useChessGame";
import { useStockfish } from "@/hooks/useStockfish";
import { useBoardSelection } from "@/hooks/useBoardSelection";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useSound } from "@/hooks/useSound";
import { useMoveSounds } from "@/hooks/useMoveSounds";
import { useDifficulty } from "@/hooks/useDifficulty";
import { uciToArrow, uciToSquares } from "@/lib/uci";
import { Board } from "@/components/board/Board";
import { BestMoveBar } from "@/components/game/BestMoveBar";
import { MoveHistory } from "@/components/game/MoveHistory";
import { GameLayout } from "@/components/game/GameLayout";
import { SettingsMenu } from "@/components/settings/SettingsMenu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Logo } from "@/components/icons/Logo";

type Props = {
  initialSide: PlayerSide;
  initialShowHints: boolean;
};

export function GameScreen({ initialSide, initialShowHints }: Props) {
  const router = useRouter();
  const game = useChessGame(initialSide);
  const selection = useBoardSelection(game);
  const isDesktop = useIsDesktop();
  const sound = useSound();
  const { difficulty, update: setDifficulty } = useDifficulty();
  const {
    bestMove,
    analyzedFen,
    isAnalyzing,
    error,
    analyzePosition,
  } = useStockfish();
  const [suggestionsPaused, setSuggestionsPaused] = useState(!initialShowHints);
  const [confirmExit, setConfirmExit] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);

  // Play a sound effect when a new move is made.
  useMoveSounds(game, sound.play);

  // Suggestions are for the player's own side only — analyse just the player's
  // turn. The opponent's moves are entered manually, with no suggestion.
  useEffect(() => {
    if (game.isGameOver || suggestionsPaused) return;
    if (game.currentTurn !== game.playerSide) return;
    analyzePosition(game.fen, difficulty);
  }, [
    analyzePosition,
    game.fen,
    game.isGameOver,
    suggestionsPaused,
    difficulty,
    game.currentTurn,
    game.playerSide,
  ]);

  // Suggest only on the player's own turn (pv1 = the engine's best move), and
  // only once the result matches the board on screen — that gate prevents the
  // previous position's move from flashing right after a move is played.
  const hintMove = useMemo(() => {
    if (game.isGameOver || suggestionsPaused || isAnalyzing) return null;
    if (game.currentTurn !== game.playerSide) return null;
    if (analyzedFen !== game.fen) return null;
    return bestMove;
  }, [
    bestMove,
    isAnalyzing,
    analyzedFen,
    game.fen,
    game.currentTurn,
    game.playerSide,
    game.isGameOver,
    suggestionsPaused,
  ]);

  const hintSquares = useMemo(() => uciToSquares(hintMove), [hintMove]);

  const hintIsCapture = useMemo(() => {
    if (!hintSquares) return false;
    return !!game.game.get(hintSquares.to as Square);
  }, [hintSquares, game.game]);

  const handleMove = useCallback(
    (input: MoveInput) => {
      const ok = game.makeMove(input);
      if (ok) selection.clearSelection();
      return ok;
    },
    [game, selection],
  );

  const displayBestMove =
    suggestionsPaused ||
    isAnalyzing ||
    game.currentTurn !== game.playerSide ||
    analyzedFen !== game.fen
      ? null
      : uciToArrow(bestMove);

  const boardProps = {
    fen: game.fen,
    playerSide: game.playerSide,
    lastMove: game.lastMove,
    hintSquares,
    hintActive: !suggestionsPaused && !!hintSquares,
    hintIsCapture,
    isGameOver: game.isGameOver,
    gameOverInfo: game.gameOverInfo,
    optionSquares: selection.optionSquares,
    onMove: handleMove,
    onReset: game.reset,
    onSquareClick: selection.handleSquareClick,
  };

  const bestMovePanel = (
    <BestMoveBar
      bestMove={displayBestMove}
      awaitingOpponent={!game.isGameOver && game.currentTurn !== game.playerSide}
      isAnalyzing={isAnalyzing}
      error={error}
      suggestionsPaused={suggestionsPaused}
      canPrev={game.currentPly > 0}
      canNext={game.currentPly < game.moves.length}
      onPrev={game.goPrev}
      onNext={game.goNext}
    />
  );

  const moveHistoryProps = {
    moves: game.moves,
    currentPly: game.currentPly,
    onGoToPly: game.goToPly,
    onStart: game.goToStart,
    onPrev: game.goPrev,
    onNext: game.goNext,
    onEnd: game.goToEnd,
  };

  return (
    <div
      className="h-screen max-h-[100dvh] flex flex-col overflow-x-hidden w-full"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 shrink-0 mt-1">
        <button
          type="button"
          aria-label="Go to home"
          onClick={() => setConfirmExit(true)}
          className="cursor-pointer transition hover:opacity-70 active:scale-95"
        >
          <Logo
            style={{ height: 40, width: "auto" }}
            primaryColor="var(--logo-primary)"
            secondaryColor="var(--logo-secondary)"
          />
        </button>
        <div className="flex items-center gap-2.5">
          <SettingsMenu
            suggestionsPaused={suggestionsPaused}
            soundEnabled={sound.enabled}
            difficulty={difficulty}
            onSwitchSides={game.flipSide}
            onToggleSuggestions={() => setSuggestionsPaused((v) => !v)}
            onToggleSound={sound.toggle}
            onChangeDifficulty={setDifficulty}
            onRestart={() => setConfirmRestart(true)}
            onExit={() => setConfirmExit(true)}
          />
        </div>
      </header>

      <GameLayout
        isDesktop={isDesktop}
        board={<Board {...boardProps} />}
        bestMovePanel={bestMovePanel}
        moveHistoryStrip={<MoveHistory {...moveHistoryProps} variant="strip" />}
        moveHistoryList={<MoveHistory {...moveHistoryProps} variant="list" />}
      />

      {confirmExit && (
        <ConfirmDialog
          title="Exit game?"
          message={"Your current game will be lost"}
          confirmLabel="Exit"
          danger
          onConfirm={() => router.push("/")}
          onCancel={() => setConfirmExit(false)}
        />
      )}

      {confirmRestart && (
        <ConfirmDialog
          title="Restart game?"
          message={"This will reset the board and clear all moves"}
          confirmLabel="Restart"
          onConfirm={() => {
            selection.clearSelection();
            game.reset();
            setConfirmRestart(false);
          }}
          onCancel={() => setConfirmRestart(false)}
        />
      )}
    </div>
  );
}
