import { THEMES } from "@/lib/themes";

export function ThemeRegistry() {
  let css = "";
  
  for (const theme of THEMES) {
    // dark mode
    css += `\n[data-theme="${theme.id}-dark"] {\n  color-scheme: dark;\n`;
    for (const [key, value] of Object.entries(theme.dark)) {
      css += `  --${key}: ${value};\n`;
    }
    css += `}\n`;

    // light mode
    css += `\n[data-theme="${theme.id}-light"] {\n  color-scheme: light;\n`;
    for (const [key, value] of Object.entries(theme.light)) {
      css += `  --${key}: ${value};\n`;
    }
    css += `}\n`;
  }

  // Fallback :root definition to satisfy Tailwind's default expectation
  const fallback = THEMES[0].dark;
  css = `:root {\n  color-scheme: dark;\n` + 
    Object.entries(fallback).map(([key, value]) => `  --${key}: ${value};`).join("\n") +
    `\n}\n` + css;

  return <style dangerouslySetInnerHTML={{ __html: css }} suppressHydrationWarning />;
}
