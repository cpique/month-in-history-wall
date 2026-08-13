"use client";

import { useEffect, useState } from "react";

export function WallFullscreenShell({
  children,
  fullscreen,
}: {
  children: React.ReactNode;
  fullscreen: React.ReactNode;
}) {
  const [isWallOnly, setIsWallOnly] = useState(false);

  useEffect(() => {
    if (!isWallOnly) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsWallOnly(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isWallOnly]);

  return (
    <>
      <div className="flex justify-end">
        <button
          className="border border-[var(--border-primary)] bg-[var(--text-primary)] px-4 py-3 text-sm uppercase tracking-wide text-[var(--bg-primary)]"
          onClick={() => setIsWallOnly(true)}
          type="button"
        >
          Wall only
        </button>
      </div>
      {children}
      {isWallOnly ? (
        <div className="fixed inset-0 z-50 bg-[var(--bg-wall)] p-3">
          <button
            aria-label="Exit wall-only view"
            className="absolute right-4 top-4 z-10 border border-[var(--text-on-wall)] bg-[var(--bg-wall)] px-3 py-2 text-sm uppercase tracking-wide text-[var(--text-on-wall)]"
            onClick={() => setIsWallOnly(false)}
            type="button"
          >
            Exit
          </button>
          <div className="h-full pt-12">{fullscreen}</div>
        </div>
      ) : null}
    </>
  );
}
