import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  primaryColor?: string;
  secondaryColor?: string;
};

export function Logo({
  primaryColor = "#1C2428",
  secondaryColor = "#849EA7",
  ...props
}: Props) {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <rect
        x="69.39"
        y="138.972"
        width="98.1327"
        height="98.1327"
        transform="rotate(-134.841 69.39 138.972)"
        fill={primaryColor}
      />
      <path
        d="M99.0885 99.3743L69.39 69.6758L99.0885 39.9773L128.787 69.6758L99.0885 99.3743Z"
        fill={secondaryColor}
      />
      <path
        d="M39.6915 99.3743L9.99307 69.6758L39.6916 39.9773L69.39 69.6758L39.6915 99.3743Z"
        fill={secondaryColor}
      />
    </svg>
  );
}
