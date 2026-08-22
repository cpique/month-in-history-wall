"use client";

import { useCallback, useState } from "react";

export function EventShareButton({
  label = "Share event",
  title,
  url,
}: {
  label?: string;
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    if (typeof navigator === "undefined") {
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // Ignore user cancellations and missing APIs.
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      setCopied(false);
    }
  }, [title, url]);

  return (
    <button
      aria-label={label}
      className="w-fit border border-[var(--border-primary)] px-4 py-3 text-sm uppercase tracking-wide"
      onClick={handleShare}
      type="button"
    >
      {copied ? "Link copied" : label}
    </button>
  );
}
