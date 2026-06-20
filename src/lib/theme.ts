export type ThemeMode = "light" | "dark";

/**
 * Apply a theme + light/dark mode at runtime and keep the browser's
 * meta[theme-color] in sync. (The pre-paint equivalent lives inline in
 * ThemeScript to avoid a flash of the wrong colours on first load.)
 */
export function applyTheme(theme: string, mode: ThemeMode) {
  document.documentElement.setAttribute("data-theme", `${theme}-${mode}`);
  document.documentElement.classList.toggle("light", mode === "light");
  document.documentElement.classList.toggle("dark", mode === "dark");

  const color =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--theme-color")
      .trim() || (mode === "dark" ? "#1C2428" : "#E6EEF2");

  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", color);
}
