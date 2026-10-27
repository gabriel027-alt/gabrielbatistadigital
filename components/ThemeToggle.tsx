"use client";
import { useSyncExternalStore } from "react";
import { applyTheme, THEME_KEY } from "@/lib/theme";
import { Sun, Moon } from "./ui/icons";
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}
export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme === "dark",
    () => true,
  );
  return (
    <button
      className="icon-button theme-toggle"
      type="button"
      aria-pressed={dark}
      aria-label="Alternar tema claro e escuro"
      onClick={() => {
        const next =
          document.documentElement.dataset.theme === "light" ? "dark" : "light";
        applyTheme(next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {}
      }}
    >
      <Sun className="theme-sun" />
      <Moon className="theme-moon" />
    </button>
  );
}
