import { Theme } from "./types";
import { duolingoTheme } from "./duolingo";
import { defaultTheme } from "./default";

export const THEMES: Theme[] = [
  duolingoTheme,
  defaultTheme,
];

export * from "./types";
