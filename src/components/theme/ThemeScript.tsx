/**
 * Inline script that runs before paint to apply the saved theme,
 * preventing a flash of the wrong color scheme on load.
 * Default is dark mode and default theme to match the chess design.
 */
export function ThemeScript() {
  const script = `
    (function () {
      try {
        var theme = localStorage.getItem('app-theme') || 'default';
        var mode = localStorage.getItem('app-mode') || 'dark';
        document.documentElement.setAttribute('data-theme', theme + '-' + mode);

        // Toggle standard Tailwind dark class just in case any utility relies on it
        document.documentElement.classList.toggle('dark', mode === 'dark');
        document.documentElement.classList.toggle('light', mode === 'light');

        var token = getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim();
        var color = token || (mode === 'dark' ? '#1C2428' : '#E6EEF2');
        var meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', 'theme-color');
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', color);
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
