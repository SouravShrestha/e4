import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { ThemeRegistry } from "@/components/theme/ThemeRegistry";

const uberMoveBold = localFont({
  src: "../fonts/UberMoveBold.ttf",
  variable: "--font-uber-move",
  display: "swap",
});

const uberMoveMedium = localFont({
  src: "../fonts/UberMoveMedium.ttf",
  variable: "--font-uber-move-medium",
  display: "swap",
});

const latoRegular = localFont({
  src: "../fonts/Lato-Regular.ttf",
  variable: "--font-lato",
  display: "swap",
});

const latoLight = localFont({
  src: "../fonts/Lato-Light.ttf",
  variable: "--font-lato-light",
  display: "swap",
});

export const metadata: Metadata = {
  title: "e4! chess moves",
  description:
    "A local, browser-only Stockfish analysis board with move hints, navigable history and engine evaluation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeRegistry />
        <ThemeScript />
      </head>
      <body
        className={`antialiased ${uberMoveBold.variable} ${uberMoveMedium.variable} ${latoRegular.variable} ${latoLight.variable}`}
        suppressHydrationWarning
      >
        <div className="relative flex max-w-[860px] mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
