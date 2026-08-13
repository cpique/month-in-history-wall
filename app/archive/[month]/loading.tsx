export default function ArchiveMonthLoading() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[minmax(300px,0.58fr)_minmax(620px,1.42fr)]">
        <aside className="flex min-h-[720px] flex-col justify-between border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
          <div className="space-y-8">
            <div className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide text-[var(--text-muted)]">
              <span>Archive</span>
              <span>Current wall</span>
            </div>
            <div className="space-y-5">
              <p className="h-4 w-36 bg-[var(--border-tertiary)]" />
              <p className="h-16 w-56 bg-[var(--border-tertiary)]" />
              <p className="h-5 w-32 bg-[var(--border-tertiary)]" />
              <div className="space-y-3">
                <p className="h-4 w-full bg-[var(--border-tertiary)]" />
                <p className="h-4 w-4/5 bg-[var(--border-tertiary)]" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 border border-[var(--border-primary)]">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="border-[var(--border-primary)] p-4 odd:border-r first:border-b [&:nth-child(2)]:border-b"
                key={index}
              >
                <p className="h-8 w-12 bg-[var(--border-tertiary)]" />
                <p className="mt-2 h-3 w-16 bg-[var(--border-tertiary)]" />
              </div>
            ))}
          </div>
        </aside>
        <div className="flex min-h-[720px] flex-col border border-[var(--border-primary)] bg-[var(--bg-wall)] p-3">
          <div className="mb-3 h-5 w-72 bg-[var(--border-wall)]" />
          <div className="grid flex-1 auto-rows-[72px] grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-9">
            {Array.from({ length: 24 }).map((_, index) => (
              <div
                className="border border-[var(--border-wall)] bg-[var(--bg-wall-panel)]"
                key={index}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
