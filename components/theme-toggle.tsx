"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme") as Theme | null;
    const resolved = saved ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(resolved);
    setTheme(resolved);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setExplicitTheme(nextTheme);
  }

  function setExplicitTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
  }

  if (compact) {
    return (
      <div className="theme-switcher" aria-label="Theme selector">
        <span className="theme-switcher-label">Theme</span>
        <div className="theme-switcher-track">
          <button
            type="button"
            className="theme-switcher-option"
            data-active={theme === "light"}
            onClick={() => setExplicitTheme("light")}
          >
            Light
          </button>
          <button
            type="button"
            className="theme-switcher-option"
            data-active={theme === "dark"}
            onClick={() => setExplicitTheme("dark")}
          >
            Dark
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="theme-edge-toggle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <span className="theme-edge-toggle-kicker">Theme</span>
      <span className="theme-edge-toggle-label">{theme === "light" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}
