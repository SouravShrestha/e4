"use client";

import { useMemo } from "react";
import { KnightIcon } from "@/components/icons/KnightIcon";
import { RookIcon } from "@/components/icons/RookIcon";
import { QueenIcon } from "@/components/icons/QueenIcon";
import { KingIcon } from "@/components/icons/KingIcon";
import { BishopIcon } from "@/components/icons/BishopIcon";
import { PawnIcon } from "@/components/icons/PawnIcon";
import type { ComponentType, SVGProps } from "react";

type PieceIconProps = SVGProps<SVGSVGElement> & {
  pieceBorder?: string;
  pieceFill?: string;
};

type PieceProps = { svgStyle?: React.CSSProperties };

function usePieceColors() {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return {
        white: { pieceBorder: "#29abe2", pieceFill: "#b6ecff" },
        black: { pieceBorder: "#1566a0", pieceFill: "#2d8fc4" },
      };
    }
    const style = getComputedStyle(document.documentElement);
    return {
      white: {
        pieceBorder: style.getPropertyValue("--piece-border-white").trim() || "#29abe2",
        pieceFill:   style.getPropertyValue("--piece-fill-white").trim()   || "#b6ecff",
      },
      black: {
        pieceBorder: style.getPropertyValue("--piece-border-black").trim() || "#1566a0",
        pieceFill:   style.getPropertyValue("--piece-fill-black").trim()   || "#2d8fc4",
      },
    };
  }, []);
}

function makePiece(
  Icon: ComponentType<PieceIconProps>,
  alt: string,
  pt: string,
  size: string,
  side: "white" | "black"
) {
  return function Piece(_props?: PieceProps) {
    const colors = usePieceColors();
    const { pieceBorder, pieceFill } = colors[side];
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className={pt}
      >
        <Icon
          pieceBorder={pieceBorder}
          pieceFill={pieceFill}
          aria-label={alt}
          aria-hidden={undefined}
          style={{ width: size, height: size }}
        />
      </div>
    );
  };
}

export const cutePieces = {
  wP: makePiece(PawnIcon,   "white pawn",   "pt-2.5", "63%", "white"),
  wR: makePiece(RookIcon,   "white rook",   "pt-2.5", "62%", "white"),
  wN: makePiece(KnightIcon, "white knight", "pt-2",   "65%", "white"),
  wB: makePiece(BishopIcon, "white bishop", "pt-2",   "65%", "white"),
  wQ: makePiece(QueenIcon,  "white queen",  "pt-2",   "65%", "white"),
  wK: makePiece(KingIcon,   "white king",   "pt-2",   "65%", "white"),
  bP: makePiece(PawnIcon,   "black pawn",   "pt-2.5", "63%", "black"),
  bR: makePiece(RookIcon,   "black rook",   "pt-2.5", "62%", "black"),
  bN: makePiece(KnightIcon, "black knight", "pt-2",   "65%", "black"),
  bB: makePiece(BishopIcon, "black bishop", "pt-2",   "65%", "black"),
  bQ: makePiece(QueenIcon,  "black queen",  "pt-2",   "65%", "black"),
  bK: makePiece(KingIcon,   "black king",   "pt-2",   "62%", "black"),
};
