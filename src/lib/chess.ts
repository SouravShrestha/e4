import { Chess } from "chess.js";

export const STARTING_FEN = new Chess().fen();

export function createChess(fen?: string) {
  return new Chess(fen);
}

export function isValidFen(fen: string) {
  try {
    new Chess(fen);
    return true;
  } catch {
    return false;
  }
}
