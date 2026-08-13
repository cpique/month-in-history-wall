import Link from "next/link";
import { WorkMedia } from "@/components/exhibition/work-media";
import type { Exhibition, ExhibitionSpace } from "@/lib/exhibition-data";

function EventBrowseCard({
  label,
  event,
  align = "left",
}: {
  label: string;
  event?: ExhibitionSpace;
  align?: "left" | "right";
}) {
  if (!event) {
    return (
      <span
        className={`border border-[var(--border-secondary)] px-3 py-3 text-sm text-[var(--text-muted)] ${
          align === "right" ? "text-right" : ""
        }`}
      >
        {label}
      </span>
    );
  }

  const mediaUrl = event.mediaPreview?.mediaUrl;

  return (
    <Link
      aria-label={`${label}: ${event.title}`}
      className={`group grid min-h-36 overflow-hidden border border-[var(--border-primary)] ${
        align === "right" ? "text-right" : ""
      }`}
      href={`/events/${event.id}`}
    >
      <span className="relative flex min-h-24 flex-col justify-end overflow-hidden p-3">
        {mediaUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={mediaUrl}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.78))]"
            />
          </>
        ) : (
          <span
            aria-hidden="true"
            className={`${event.className} absolute inset-0 block`}
          />
        )}
        <span className="relative text-xs uppercase tracking-wide text-[#f8f1df]">
          {label}
        </span>
        <span className="relative mt-1 text-lg font-semibold leading-tight text-[#f8f1df]">
          {event.title}
        </span>
      </span>
      <span className="grid gap-1 bg-[var(--bg-card)] px-3 py-3 text-sm leading-5">
        <span>{event.creator}</span>
        <span className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
          {event.medium} / {event.category}
        </span>
      </span>
    </Link>
  );
}

export function EventDetail({
  currentPosition,
  event,
  exhibition,
  nextEvent,
  previousEvent,
  totalEvents,
}: {
  currentPosition: number;
  event: ExhibitionSpace;
  exhibition: Exhibition;
  nextEvent?: ExhibitionSpace;
  previousEvent?: ExhibitionSpace;
  totalEvents: number;
}) {
  const sources = event.sources ?? [];

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <div className="grid min-h-[calc(100vh-40px)] gap-8 lg:grid-cols-[minmax(280px,0.62fr)_minmax(560px,1.38fr)]">
        <aside className="flex flex-col justify-between border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
          <div className="space-y-8">
            <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
              <Link href="/">Month in History Wall</Link>
              <span>{exhibition.monthLabel}</span>
            </nav>

            <div className="space-y-4">
              <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
                Event {currentPosition} of {totalEvents} / {event.importanceLevel ?? event.size}
              </p>
              <h1 className="text-5xl font-semibold leading-none sm:text-6xl">
                {event.title}
              </h1>
              <p className="text-xl text-[var(--text-secondary)]">{event.creator}</p>
            </div>
          </div>

          <div className="mt-10 space-y-3">
            <Link
              className="inline-flex w-fit border border-[var(--border-primary)] px-4 py-3 text-sm uppercase tracking-wide"
              href="/?view=published"
            >
              Back to published wall
            </Link>
            <nav aria-label="Browse published events" className="grid grid-cols-2 gap-2">
              <EventBrowseCard
                event={previousEvent}
                label={previousEvent ? "Previous event" : "First published event"}
              />
              <EventBrowseCard
                align="right"
                event={nextEvent}
                label={nextEvent ? "Next event" : "Last published event"}
              />
            </nav>
          </div>
        </aside>

        <section className="grid gap-5 border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid content-center">
            {event.mediaPreview ? (
              <WorkMedia preview={event.mediaPreview} />
            ) : (
              <div
                className={`${event.className} flex min-h-[420px] flex-col justify-between border border-[var(--border-primary)] p-5 sm:p-7`}
              >
                <span className="text-sm uppercase tracking-wide">
                  {event.medium}
                </span>
                <p className="text-3xl font-semibold leading-tight sm:text-5xl">
                  {event.title}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-8 border border-[var(--border-primary)] p-5">
            <div className="space-y-6">
              <div className="grid gap-2 text-sm uppercase tracking-wide text-[var(--text-muted)] sm:grid-cols-2">
                <span>{event.category}</span>
                <span className="sm:text-right">{event.medium}</span>
                {event.location ? <span>{event.location}</span> : null}
                {event.importanceLevel ? (
                  <span className="sm:text-right">{event.importanceLevel}</span>
                ) : null}
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  What happened
                </p>
                <p className="text-lg leading-8 text-[var(--text-secondary)]">
                  {event.description}
                </p>
              </div>

              {event.context ? (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    Context
                  </p>
                  <p className="text-base leading-7 text-[var(--text-secondary)]">
                    {event.context}
                  </p>
                </div>
              ) : null}

              {event.whyItMatters ? (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    Why it matters
                  </p>
                  <p className="text-base leading-7 text-[var(--text-secondary)]">
                    {event.whyItMatters}
                  </p>
                </div>
              ) : null}

              {event.detailMarkdown ? (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    Detail
                  </p>
                  <div className="whitespace-pre-wrap text-base leading-7 text-[var(--text-secondary)]">
                    {event.detailMarkdown}
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  Sources
                </p>
                {sources.length > 0 ? (
                  <ol className="grid gap-3">
                    {sources.map((source) => (
                      <li
                        className="border border-[var(--border-secondary)] p-3"
                        key={source.url}
                      >
                        <a
                          className="font-semibold underline underline-offset-4"
                          href={source.url}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {source.title}
                        </a>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                          {source.publisher ?? "Source"} / {source.sourceType}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm leading-6 text-[var(--text-muted)]">
                    No public source citation has been attached yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
