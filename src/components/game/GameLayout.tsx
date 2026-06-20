import type { ReactNode } from "react";

type Props = {
  /** null until the breakpoint is measured; gates which column mounts the board. */
  isDesktop: boolean | null;
  board: ReactNode;
  bestMovePanel: ReactNode;
  moveHistoryStrip: ReactNode;
  moveHistoryList: ReactNode;
};

/**
 * The two responsive game layouts. The board is passed as a single node and
 * mounted in exactly one column (gated by `isDesktop`) so the chessboard never
 * mounts twice.
 */
export function GameLayout({
  isDesktop,
  board,
  bestMovePanel,
  moveHistoryStrip,
  moveHistoryList,
}: Props) {
  return (
    <>
      {/* ── Compact layout (phones / narrow windows): single column ── */}
      <main className="flex-1 flex flex-col w-full mx-auto min-[860px]:hidden overflow-y-auto">
        <div className="w-full shrink-0 flex items-center justify-center mt-12">
          <div className="w-full max-h-[50vh] flex justify-center items-center">
            <div
              className="border-t border-b border-divider relative"
              style={{ backgroundColor: "var(--board-light)" }}
            >
              <div className="w-full max-w-[100%] aspect-square">
                {isDesktop === false && board}
              </div>
            </div>
          </div>
        </div>
        <div className="shrink-0 mt-4">{bestMovePanel}</div>
        <div className="pb-2 shrink-0 mt-4">{moveHistoryStrip}</div>
      </main>

      {/* ── Desktop layout (board left, scrollable move list right) ── */}
      <main className="hidden min-[860px]:flex flex-1 items-center justify-center gap-8 px-6">
        {/* Board column — square, capped to fit alongside the sidebar */}
        <div
          className="flex flex-col h-full justify-center shrink-0"
          style={{
            width: "min(calc(100vh - 180px), calc(100vw - 360px), 620px)",
          }}
        >
          <div
            className="w-full aspect-square border border-divider"
            style={{ backgroundColor: "var(--board-light)" }}
          >
            {isDesktop === true && board}
          </div>
          <div className="shrink-0">{bestMovePanel}</div>
        </div>

        {/* Sidebar — vertical, scrollable move list */}
        <div
          className="flex h-full flex-col pt-4 pb-9 shrink-0"
          style={{ width: 180 }}
        >
          <h2
            className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            Moves
          </h2>
          <div className="h-[320px] pt-2">{moveHistoryList}</div>
        </div>
      </main>
    </>
  );
}
