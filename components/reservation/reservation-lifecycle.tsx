import type { ReservationStatus } from "@/lib/reservation-state";

const lifecycle: Array<{
  status: ReservationStatus;
  label: string;
  detail: string;
}> = [
  {
    status: "draft",
    label: "Draft",
    detail: "Choose a duration and prepare submission details.",
  },
  {
    status: "held",
    label: "Held",
    detail: "The selected size and visibility category is temporarily held while payment is authorized.",
  },
  {
    status: "submitted",
    label: "Submitted",
    detail: "Required fields and policy acknowledgement are complete.",
  },
  {
    status: "approved",
    label: "Approved",
    detail: "Manual review clears the work for publication.",
  },
];

export function ReservationLifecycle({
  currentStatus,
}: {
  currentStatus: ReservationStatus;
}) {
  const currentIndex = lifecycle.findIndex(({ status }) => status === currentStatus);

  return (
    <section className="border border-[var(--border-primary)] p-4" aria-labelledby="lifecycle-title">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-sm uppercase tracking-wide" id="lifecycle-title">
          Reservation lifecycle
        </h2>
        <p className="text-sm text-[var(--text-muted)]">Current: {currentStatus}</p>
      </div>
      <ol className="mt-4 grid gap-3 sm:grid-cols-4">
        {lifecycle.map((step, index) => {
          const isCurrent = step.status === currentStatus;
          const isComplete = currentIndex > index;

          return (
            <li
              className={`border p-3 ${isCurrent ? "border-[var(--border-primary)] bg-[var(--bg-success)]" : "border-[var(--border-secondary)]"}`}
              key={step.status}
            >
              <p className="text-xs uppercase tracking-wide">
                {isComplete ? "Complete" : isCurrent ? "Current" : "Next"}
              </p>
              <p className="mt-2 font-semibold">{step.label}</p>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{step.detail}</p>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 border-t border-[var(--border-secondary)] pt-3 text-sm leading-6 text-[var(--text-secondary)]">
        Payment is tracked separately. It can be authorized before review, but
        publication still depends on approval.
      </p>
    </section>
  );
}
