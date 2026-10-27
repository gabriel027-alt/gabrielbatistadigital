export const THEME_KEY = "gbd-theme";
export type Theme = "light" | "dark";
export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#111410" : "#f4f3ed");
}
export function initTheme() {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const followSystem = () => {
    if (!getStoredTheme()) applyTheme(media.matches ? "dark" : "light");
  };
  // The inline bootstrap already applies the first theme before paint.
  media.addEventListener("change", followSystem);
  const sync = () =>
    applyTheme(getStoredTheme() ?? (media.matches ? "dark" : "light"));
  window.addEventListener("storage", sync);
  return () => {
    media.removeEventListener("change", followSystem);
    window.removeEventListener("storage", sync);
  };
}
