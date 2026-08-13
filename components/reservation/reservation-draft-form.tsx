"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import {
  createCheckoutSession,
  createReservationDraft,
} from "@/app/actions";

type DraftSummary = {
  creator: string;
  email: string;
  workTitle: string;
  mediaKind: string;
  description: string;
  externalUrl: string;
  altText: string;
  policyAcknowledged: boolean;
  startMonth: string;
  months: string;
};

export function ReservationDraftForm({
  spaceId,
  availableMonths,
  priceLabel,
  size,
}: {
  spaceId: string;
  availableMonths: string[];
  priceLabel: string;
  size: string;
}) {
  const [duration, setDuration] = useState(1);
  const [mediaKind, setMediaKind] = useState("image");
  const [isReady, setIsReady] = useState(false);
  const [draftSummary, setDraftSummary] = useState<DraftSummary | null>(null);
  const [result, setResult] = useState<
    | { success: true; reservationId: string; submissionId: string }
    | { success: false; error: string }
    | null
  >(null);
  const [isPending, startTransition] = useTransition();
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedStartMonth, setSelectedStartMonth] = useState(availableMonths[0] ?? "");
  const startMonths = availableMonths.slice(0, availableMonths.length - duration + 1);
  const activeStartMonth = startMonths.includes(selectedStartMonth)
    ? selectedStartMonth
    : startMonths[0] ?? "";
  const selectedMonths = availableMonths.slice(
    availableMonths.indexOf(activeStartMonth),
    availableMonths.indexOf(activeStartMonth) + duration,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setIsReady(true);
    setDraftSummary({
      creator: String(formData.get("creator")),
      email: String(formData.get("email")),
      workTitle: String(formData.get("workTitle")),
      mediaKind: String(formData.get("mediaKind")),
      description: String(formData.get("description")),
      externalUrl: String(formData.get("externalUrl") ?? ""),
      altText: String(formData.get("altText") ?? ""),
      policyAcknowledged: formData.get("policyAcknowledgement") === "on",
      startMonth: activeStartMonth,
      months: selectedMonths.join(", "),
    });
    setResult(null);

    startTransition(async () => {
      const response = await createReservationDraft(formData);
      setResult(response);
    });
  }

  async function handleCheckout() {
    if (!result?.success) return;

    setPaymentError(null);
    setIsPaymentPending(true);

    const response = await createCheckoutSession(result.reservationId);

    setIsPaymentPending(false);

    if (response.success) {
      window.location.href = response.url;
    } else {
      setPaymentError(response.error);
    }
  }

  function handleChange() {
    setIsReady(false);
    setDraftSummary(null);
    setResult(null);
    setPaymentError(null);
  }

  return (
    <form
      className="grid gap-4 border border-[var(--border-primary)] p-4"
      onChange={handleChange}
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="spaceId" value={spaceId} />
      <div className="grid gap-2">
        <label className="text-sm uppercase tracking-wide" htmlFor="creator">
          Creator or organization
        </label>
        <input
          className="border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-3"
          id="creator"
          name="creator"
          placeholder="Your name"
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm uppercase tracking-wide" htmlFor="email">
          Email
        </label>
        <input
          className="border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-3"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <label className="text-sm uppercase tracking-wide" htmlFor="workTitle">
            Work title
          </label>
          <input
            className="border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-3"
            id="workTitle"
            name="workTitle"
            placeholder="Title of the work"
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm uppercase tracking-wide" htmlFor="mediaKind">
            Media type
          </label>
          <select
            className="border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-3"
            onChange={(event) => setMediaKind(event.target.value)}
            value={mediaKind}
            id="mediaKind"
            name="mediaKind"
          >
            <option value="image">Image</option>
            <option value="gif">GIF</option>
            <option value="text">Text</option>
            <option value="video_preview">Video preview</option>
          </select>
        </div>
      </div>
      {mediaKind !== "text" ? (
        <div className="grid gap-2">
          <label className="text-sm uppercase tracking-wide" htmlFor="mediaFile">
            Media upload
          </label>
          <input
            accept={
              mediaKind === "video_preview"
                ? "video/mp4,video/webm"
                : "image/*"
            }
            className="border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-3 file:mr-4 file:border-0 file:bg-[var(--text-primary)] file:px-3 file:py-2 file:text-sm file:uppercase file:tracking-wide file:text-[var(--bg-primary)]"
            id="mediaFile"
            name="mediaFile"
            required
            type="file"
          />
        </div>
      ) : null}
      <div className="grid gap-2">
        <label className="text-sm uppercase tracking-wide" htmlFor="description">
          Short description
        </label>
        <textarea
          className="min-h-28 border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-3"
          id="description"
          name="description"
          placeholder="What would visitors open in the detail view?"
          required
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <label className="text-sm uppercase tracking-wide" htmlFor="externalUrl">
            External link <span className="normal-case opacity-60">(optional)</span>
          </label>
          <input
            className="border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-3"
            id="externalUrl"
            name="externalUrl"
            placeholder="https://..."
            type="url"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm uppercase tracking-wide" htmlFor="altText">
            Alt text {mediaKind === "text" ? "(optional)" : ""}
          </label>
          <input
            className="border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-3"
            id="altText"
            name="altText"
            placeholder="Describe the work"
            required={mediaKind !== "text"}
          />
        </div>
      </div>
      <fieldset className="grid gap-3">
        <legend className="text-sm uppercase tracking-wide">Reservation length</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 3].map((months) => {
            const isAvailable = availableMonths.length >= months;

            return (
              <label
                className={`border border-[var(--border-primary)] p-4 ${isAvailable ? "cursor-pointer" : "opacity-45"}`}
                key={months}
              >
                <input
                  className="sr-only"
                  checked={duration === months}
                  disabled={!isAvailable}
                  name="duration"
                  onChange={() => setDuration(months)}
                  type="radio"
                  value={months}
                />
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-lg font-semibold">
                      {months} {months === 1 ? "month" : "months"}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-[var(--text-secondary)]">
                      {isAvailable
                        ? "Same size and similar visibility"
                        : "Not available for this slot"}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-sm uppercase tracking-wide">
                    {duration === months ? "[selected]" : "[ ]"}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="grid gap-3 border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm uppercase tracking-wide" htmlFor="startMonth">
            Start month
          </label>
          <select
            className="border border-[var(--border-primary)] bg-[var(--bg-card)] px-3 py-3"
            onChange={(event) => setSelectedStartMonth(event.target.value)}
            value={activeStartMonth}
            id="startMonth"
            name="startMonth"
          >
            {startMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm leading-6 text-[var(--text-secondary)] sm:pt-7">
          <p>
            <span className="font-semibold">{size}</span> / {priceLabel}
          </p>
          <p>
            Months: {selectedMonths.join(", ")}
          </p>
        </div>
      </div>
      <div className="border border-[var(--border-primary)] bg-[var(--bg-primary)] p-3 text-sm leading-6 text-[var(--text-secondary)]">
        <label className="flex items-start gap-3">
          <input
            className="mt-1 size-4 accent-[var(--text-primary)]"
            name="policyAcknowledgement"
            required
            type="checkbox"
          />
          <span>
            I own or have permission to use this work, can provide alt text before
            publication, and understand that manual approval decides whether the
            work appears on the wall.
          </span>
        </label>
        <Link
          className="mt-3 inline-flex text-sm uppercase tracking-wide text-[var(--text-primary)] underline underline-offset-4"
          href="/policy"
          rel="noreferrer"
          target="_blank"
        >
          Read content policy
        </Link>
      </div>
      {isReady ? (
        <div
          aria-live="polite"
          className="border border-[var(--border-primary)] bg-[var(--bg-success)] p-3 text-sm leading-6"
        >
          <p className="font-semibold uppercase tracking-wide">Draft ready</p>
          {draftSummary ? (
            <dl className="mt-3 grid gap-x-4 gap-y-1 sm:grid-cols-2">
              <div>
                <dt className="text-[var(--text-secondary)]">Creator</dt>
                <dd>{draftSummary.creator}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-secondary)]">Email</dt>
                <dd>{draftSummary.email}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-secondary)]">Work</dt>
                <dd>{draftSummary.workTitle}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-secondary)]">Media</dt>
                <dd>{draftSummary.mediaKind}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[var(--text-secondary)]">Reservation</dt>
                <dd>
                  {draftSummary.startMonth} / {draftSummary.months}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[var(--text-secondary)]">Description</dt>
                <dd>{draftSummary.description}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-secondary)]">External link</dt>
                <dd>{draftSummary.externalUrl || "None"}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-secondary)]">Alt text</dt>
                <dd>{draftSummary.altText || "Not required for text"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[var(--text-secondary)]">Policy</dt>
                <dd>{draftSummary.policyAcknowledged ? "Acknowledged" : "Not acknowledged"}</dd>
              </div>
            </dl>
          ) : null}
          {result ? (
            result.success ? (
              <div className="mt-3 border border-[var(--border-primary)] bg-[var(--bg-info)] p-3">
                <p className="font-semibold uppercase tracking-wide">Draft saved</p>
                <p className="mt-1 break-all">
                  Reservation: {result.reservationId}
                </p>
                <p className="break-all">Submission: {result.submissionId}</p>
                <button
                  className="mt-3 border border-[var(--border-primary)] bg-[var(--text-primary)] px-4 py-3 text-sm uppercase tracking-wide text-[var(--bg-primary)] disabled:opacity-50"
                  disabled={isPaymentPending}
                  onClick={handleCheckout}
                  type="button"
                >
                  {isPaymentPending ? "Opening checkout..." : "Proceed to payment"}
                </button>
                {paymentError ? (
                  <p className="mt-2 text-[var(--text-secondary)]">{paymentError}</p>
                ) : null}
              </div>
            ) : (
              <div className="mt-3 border border-[var(--border-primary)] bg-[var(--bg-warning)] p-3">
                <p className="font-semibold uppercase tracking-wide">
                  Could not save draft
                </p>
                <p className="mt-1">{result.error}</p>
              </div>
            )
          ) : (
            <p className="mt-3">
              {isPending
                ? "Saving draft..."
                : "Nothing has been sent or saved yet."}
            </p>
          )}
        </div>
      ) : null}
      <button
        className="border border-[var(--border-primary)] bg-[var(--text-primary)] px-4 py-3 text-sm uppercase tracking-wide text-[var(--bg-primary)] disabled:opacity-50"
        disabled={isPending}
        type="submit"
      >
        {isPending
          ? "Saving..."
          : result?.success
            ? "Draft saved"
            : "Prepare reservation draft"}
      </button>
    </form>
  );
}
