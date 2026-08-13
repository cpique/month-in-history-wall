import type { WorkMediaPreview } from "@/lib/exhibition-data";

const frameClassByShape: Record<WorkMediaPreview["shape"], string> = {
  cinematic: "aspect-[16/9]",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  strip: "aspect-[5/2]",
};

function VisualMarks({ preview }: { preview: WorkMediaPreview }) {
  if (preview.pattern === "signal") {
    return (
      <div className="grid h-full grid-cols-6 gap-2 p-5">
        {preview.marks.map((mark, index) => (
          <span
            className="self-end border border-current"
            key={`${mark}-${index}`}
            style={{ height: mark }}
          />
        ))}
      </div>
    );
  }

  if (preview.pattern === "receipt") {
    return (
      <div className="flex h-full flex-col justify-end gap-3 p-5">
        {preview.marks.map((mark, index) => (
          <span
            className="block border-t border-current"
            key={`${mark}-${index}`}
            style={{ width: mark }}
          />
        ))}
      </div>
    );
  }

  if (preview.pattern === "frames") {
    return (
      <div className="grid h-full grid-cols-3 gap-3 p-5">
        {preview.marks.map((mark, index) => (
          <span
            className="border border-current"
            key={`${mark}-${index}`}
            style={{ marginTop: mark }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-4 gap-3 p-5">
      {preview.marks.map((mark, index) => (
        <span
          className="border border-current"
          key={`${mark}-${index}`}
          style={{ opacity: mark }}
        />
      ))}
    </div>
  );
}

export function WorkMedia({ preview }: { preview: WorkMediaPreview }) {
  const isVideo = preview.mediaUrl?.match(/\.(mp4|webm)$/i);

  return (
    <figure className="grid gap-3">
      <div
        aria-label={preview.mediaAlt ?? preview.alt}
        className={`${frameClassByShape[preview.shape]} relative overflow-hidden border border-[var(--border-primary)]`}
        role="img"
        style={{ background: preview.background, color: preview.foreground }}
      >
        {preview.mediaUrl ? (
          isVideo ? (
            <video
              className="absolute inset-0 size-full object-cover"
              controls
              muted
              src={preview.mediaUrl}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={preview.mediaAlt ?? preview.alt}
              className="absolute inset-0 size-full object-cover"
              src={preview.mediaUrl}
            />
          )
        ) : (
          <VisualMarks preview={preview} />
        )}
      </div>
      <figcaption className="text-sm leading-6 text-[var(--text-muted)]">
        {preview.caption}
      </figcaption>
    </figure>
  );
}