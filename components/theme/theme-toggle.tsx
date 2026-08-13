"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="border border-[var(--border-primary)] bg-[var(--bg-card)] px-2 py-1 text-xs uppercase tracking-wide text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      onClick={toggleTheme}
      type="button"
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}
