/// <reference lib="webworker" />

import createStockfishWeb from "@lichess-org/stockfish-web/sf_18_smallnet.js";

type AnalyzeMessage = {
  type: "analyze";
  requestId: number;
  fen: string;
  depth: number;
};

type StockfishEngine = Awaited<ReturnType<typeof createStockfishWeb>>;

let engine: StockfishEngine | null = null;
let bootPromise: Promise<void> | null = null;
let activeRequestId = 0;
let bestPvMove: string | null = null;
let readyResolver: (() => void) | null = null;
let suppressBestMove = false;
let isBooted = false;

function parseInfoLine(line: string) {
  // Capture the first move of the principal variation. As the search deepens
  // the engine emits new info lines, so this keeps the best move for the
  // deepest depth reached so far.
  const pvMovesMatch = line.match(/\bpv\s+([a-h][1-8][a-h][1-8]\S*)/);
  if (pvMovesMatch) bestPvMove = pvMovesMatch[1];
}

function handleEngineMessage(rawMessage: unknown) {
  const line = typeof rawMessage === "string" ? rawMessage : String(rawMessage);

  if (line === "uciok") {
    sendCommand("isready");
    return;
  }

  if (line === "readyok") {
    readyResolver?.();
    readyResolver = null;
    return;
  }

  if (line.startsWith("info ")) {
    parseInfoLine(line);
    return;
  }

  if (line.startsWith("bestmove ")) {
    if (suppressBestMove) return;

    const [, fallback] = line.split(/\s+/);
    self.postMessage({
      type: "result",
      requestId: activeRequestId,
      bestMove: bestPvMove ?? fallback,
    });
  }
}

function sendCommand(command: string) {
  engine?.uci(command);
}

function waitUntilReady() {
  return new Promise<void>((resolve) => {
    readyResolver = resolve;
    sendCommand("isready");
  });
}

async function ensureEngine() {
  if (engine && isBooted) return;
  if (bootPromise) {
    await bootPromise;
    return;
  }

  bootPromise = (async () => {
    // The engine needs SharedArrayBuffer, which browsers only expose in a
    // cross-origin-isolated secure context (HTTPS + COOP/COEP headers, or
    // localhost). Diagnose precisely what is missing so the error in the UI
    // is actionable rather than generic.
    const origin = self.location?.origin ?? "unknown origin";
    if (typeof SharedArrayBuffer === "undefined") {
      throw new Error(
        `[${origin}] SharedArrayBuffer is not available. ` +
          "The page must be served over HTTPS with Cross-Origin-Opener-Policy: same-origin " +
          "and Cross-Origin-Embedder-Policy: require-corp headers. " +
          "Opening via a plain http:// LAN address on mobile will always fail."
      );
    }
    if (!self.crossOriginIsolated) {
      throw new Error(
        `[${origin}] crossOriginIsolated is false/undefined. ` +
          "COOP/COEP headers are likely not being sent for this origin. " +
          "Check that the dev server is running over HTTPS and that the certificate " +
          "covers the IP/hostname you're using to access it from mobile."
      );
    }

    engine = await createStockfishWeb();
    engine.listen = handleEngineMessage;
    engine.onError = (message) => {
      self.postMessage({ type: "error", requestId: activeRequestId, message });
    };

    await new Promise<void>((resolve) => {
      readyResolver = resolve;
      sendCommand("uci");
    });

    isBooted = true;
    self.postMessage({ type: "ready" });
  })();

  await bootPromise;
}

async function cancelCurrentSearch() {
  if (!engine || !isBooted) return;
  suppressBestMove = true;
  sendCommand("stop");
  await waitUntilReady();
  suppressBestMove = false;
}

async function prepareNewGame() {
  sendCommand("ucinewgame");
  await waitUntilReady();
}

async function analyzePosition({
  requestId,
  fen,
  depth,
}: AnalyzeMessage) {
  await ensureEngine();
  await cancelCurrentSearch();

  if (requestId !== activeRequestId) return;

  bestPvMove = null;

  await prepareNewGame();

  if (requestId !== activeRequestId) return;

  sendCommand("setoption name MultiPV value 1");
  sendCommand(`position fen ${fen}`);
  sendCommand(`go depth ${depth}`);
}

self.onmessage = (event: MessageEvent<AnalyzeMessage>) => {
  const message = event.data;
  if (message.type !== "analyze") return;

  activeRequestId = message.requestId;

  analyzePosition(message).catch((error: unknown) => {
    self.postMessage({
      type: "error",
      requestId: message.requestId,
      message: error instanceof Error ? error.message : "Stockfish analysis failed."
    });
  });
};

export {};
