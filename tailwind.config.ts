import type { Config } from "tailwindcss";

const token = (name: string) => `var(--${name})`;

const config: Config = {
  darkMode: ["class", ".dark"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        "uber-move": "var(--font-uber-move)",
        "uber-move-medium": "var(--font-uber-move-medium)",
        "lato": "var(--font-lato)",
        "lato-light": "var(--font-lato-light)",
      },
      colors: {
        background: token("background"),
        surface: {
          DEFAULT: token("surface"),
          muted: token("surface-muted"),
          elevated: token("surface-elevated")
        },
        foreground: token("foreground"),
        muted: token("muted"),
        faint: token("faint"),
        border: token("border"),
        "border-subtle": token("border-subtle"),
        divider: token("divider"),
        "divider-strong": token("divider-strong"),
        accent: {
          DEFAULT: token("accent"),
          hover: token("accent-hover")
        },
        success: token("success"),
        warning: token("warning"),
        danger: token("danger")
      },
    }
  },
  plugins: []
};

export default config;
