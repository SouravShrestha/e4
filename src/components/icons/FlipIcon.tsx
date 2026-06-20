import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { size?: number | string };

export function FlipIcon({ size = 16, ...props }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      {...props}
    >
      <path d="M21 8a9 9 0 0 0-15-3.5L3 8M3 16a9 9 0 0 0 15 3.5L21 16" />
      <path d="M3 4v4h4M21 20v-4h-4" />
    </svg>
  );
}
