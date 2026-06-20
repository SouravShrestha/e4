import { GameScreen } from "@/components/game/GameScreen";
import type { PlayerSide } from "@/hooks/useChessGame";

type SearchParams = Promise<{ side?: string; hints?: string }>;

export default async function PlayPage({ searchParams }: { searchParams: SearchParams }) {
  const { side, hints } = await searchParams;
  const initialSide: PlayerSide = side === "b" ? "b" : "w";
  const initialShowHints = hints !== "0";

  return <GameScreen initialSide={initialSide} initialShowHints={initialShowHints} />;
}
