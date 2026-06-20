"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { depthForLevel, type Difficulty } from "@/lib/difficulty";

type WorkerResultMessage = {
  type: "result";
  requestId: number;
  bestMove: string;
};

type WorkerErrorMessage = {
  type: "error";
  requestId: number;
  message: string;
};

type WorkerReadyMessage = {
  type: "ready";
};

type WorkerMessage = WorkerResultMessage | WorkerErrorMessage | WorkerReadyMessage;

// If the engine never answers (e.g. it silently failed to boot on a device
// without SharedArrayBuffer), surface a clear message instead of hanging.
const ANALYSIS_TIMEOUT_MS = 25_000;

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  // FEN of the most recent analysis request, so completed results can be
  // matched to the position they describe (and stale ones ignored).
  const requestFenRef = useRef<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [bestMove, setBestMove] = useState<string | null>(null);
  const [analyzedFen, setAnalyzedFen] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearWatchdog = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const failWith = useCallback(
    (message: string) => {
      console.error("[useStockfish] Engine failure:", message);
      clearWatchdog();
      setIsAnalyzing(false);
      setBestMove(null);
      setAnalyzedFen(null);
      setError(message);
    },
    [clearWatchdog]
  );

  useEffect(() => {
    let worker: Worker;
    try {
      worker = new Worker(new URL("../workers/stockfish.worker.ts", import.meta.url), {
        type: "module"
      });
    } catch {
      failWith("Your browser couldn't start the engine worker.");
      return;
    }

    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      if (message.type === "ready") return;
      if (message.requestId !== requestIdRef.current) return;

      clearWatchdog();
      setIsAnalyzing(false);

      if (message.type === "error") {
        failWith(message.message);
        return;
      }

      setError(null);
      setBestMove(message.bestMove);
      setAnalyzedFen(requestFenRef.current);
    };

    // Worker-level failures (module load errors, crashes) don't arrive as
    // normal messages — catch them so the UI doesn't stall.
    worker.onerror = (event: ErrorEvent) => {
      const detail = event.message || event.error?.message || "unknown error";
      const location = event.filename ? ` (${event.filename}:${event.lineno})` : "";
      failWith(`Engine failed to load: ${detail}${location}`);
    };
    worker.onmessageerror = () => failWith("Received a malformed message from the engine.");

    return () => {
      clearWatchdog();
      worker.terminate();
      workerRef.current = null;
    };
  }, [clearWatchdog, failWith]);

  const analyzePosition = useCallback(
    (fen: string, difficulty: Difficulty) => {
      const worker = workerRef.current;
      if (!worker) return;

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      requestFenRef.current = fen;

      setBestMove(null);
      setAnalyzedFen(null);
      setError(null);
      setIsAnalyzing(true);

      clearWatchdog();
      timeoutRef.current = setTimeout(() => {
        if (requestIdRef.current === requestId) {
          const origin = typeof window !== "undefined" ? window.location.origin : "unknown";
          const isolated = typeof window !== "undefined" ? window.crossOriginIsolated : false;
          const hasSAB = typeof SharedArrayBuffer !== "undefined";
          console.error(
            `[useStockfish] Analysis timed out after ${ANALYSIS_TIMEOUT_MS}ms.`,
            { origin, crossOriginIsolated: isolated, hasSharedArrayBuffer: hasSAB }
          );
          failWith(
            `Engine timed out [${origin}]. ` +
              `crossOriginIsolated=${isolated}, SharedArrayBuffer=${hasSAB}. ` +
              "This page must be served over HTTPS with correct COOP/COEP headers."
          );
        }
      }, ANALYSIS_TIMEOUT_MS);

      worker.postMessage({
        type: "analyze",
        requestId,
        fen,
        depth: depthForLevel(difficulty.level),
      });
    },
    [clearWatchdog, failWith]
  );

  return { bestMove, analyzedFen, isAnalyzing, error, analyzePosition };
}
