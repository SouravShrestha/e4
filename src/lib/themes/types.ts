export type ThemeColors = {
  darkbackground: string;
  background: string;
  surface: string;
  "surface-muted": string;
  "surface-elevated": string;

  foreground: string;
  disabled: string;
  muted: string;
  faint: string;
  footer: string;

  border: string;
  "border-subtle": string;
  divider: string;
  "divider-strong": string;
  "border-muted": string;
  "border-emphasis": string;

  accent: string;
  "accent-hover": string;
  "accent-soft": string;

  success: string;
  warning: string;
  danger: string;
  "danger-border": string;

  "board-light": string;
  "board-dark": string;
  "board-coordinate": string;

  "element-background": string;
  "element-foreground": string;

  "square-last-move": string;
  "square-selected": string;
  "move-dot": string;
  "capture-ring": string;
  "hint-fill": string;
  "hint-ring": string;
  "hint-arrow": string;
  "hint-capture-arrow": string;

  "arrow-primary": string;
  "arrow-secondary": string;
  "arrow-tertiary": string;

  "eval-white": string;
  "eval-black": string;

  "play-button": string;
  "play-button-text": string;
  "start-panel-bg": string;

  scrim: string;
  "overlay-gameover": string;

  "grid-line": string;
  glow: string;

  "piece-border-white": string;
  "piece-fill-white": string;
  "piece-border-black": string;
  "piece-fill-black": string;

  "logo-bg": string;
  "logo-border": string;
  "logo-text": string;
  "logo-accent": string;
  "logo-primary": string;
  "logo-secondary": string;

  "theme-color": string;
};

export type Theme = {
  id: string;
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
};
