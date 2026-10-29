"use client";
import { useSyncExternalStore } from "react";
import { applyTheme, THEME_KEY } from "@/lib/theme";
import { Sun, Moon } from "./ui/icons";
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme === "dark", () => true);
  function change(next: "light" | "dark") {
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch {}
  }
  return (
    <div className="theme-switch" role="group" aria-label="Iluminação do estúdio">
      <span className="theme-switch-indicator" aria-hidden="true" />
      <button type="button" aria-pressed={!dark} onClick={() => change("light")}><Sun /><span>Dia</span></button>
      <button type="button" aria-pressed={dark} onClick={() => change("dark")}><Moon /><span>Noite</span></button>
    </div>
  );
}
