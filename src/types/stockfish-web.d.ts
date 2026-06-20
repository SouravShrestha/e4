declare module "@lichess-org/stockfish-web/sf_18_smallnet.js" {
  type StockfishWebModule = {
    uci(command: string): void;
    listen: (data: string) => void;
    onError: (message: string) => void;
    setNnueBuffer(data: Uint8Array, index?: number): void;
    getRecommendedNnue(index?: number): string | undefined;
  };

  export default function createStockfishWeb(
    moduleOptions?: Partial<StockfishWebModule>
  ): Promise<StockfishWebModule>;
}
