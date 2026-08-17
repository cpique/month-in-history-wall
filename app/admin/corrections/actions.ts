"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/admin-auth";
import type { CorrectionRequestStatus } from "@/lib/domain-types";
import { getCorrectionRequestById, updateCorrectionRequestStatus, VALID_CORRECTION_STATUSES } from "@/lib/correction-repository";
import { recordEditorialEvent } from "@/lib/editorial-event-repository";

export async function updateCorrectionStatus(formData: FormData) {
  const actorId = await requireAdminAuth();

  if (!process.env.MONGODB_URI) {
    throw new Error("Correction review requires a MongoDB connection.");
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as CorrectionRequestStatus;

  if (!id.trim() || !VALID_CORRECTION_STATUSES.has(status)) {
    throw new Error("Invalid correction request update.");
  }

  const previous = await getCorrectionRequestById(id);
  if (!previous) throw new Error("Correction request not found.");

  await updateCorrectionRequestStatus(id, status);
  await recordEditorialEvent({
    type: "correction_reviewed",
    actorId,
    monthSlug: previous.monthSlug,
    eventId: previous.eventId,
    metadata: {
      fromStatus: previous.status,
      toStatus: status,
      correctionRequestId: previous._id,
    },
  });
  revalidatePath("/admin/corrections");
}
