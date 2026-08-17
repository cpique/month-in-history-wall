"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/admin-auth";
import type { CorrectionRequestStatus } from "@/lib/domain-types";
import { updateCorrectionRequestStatus, VALID_CORRECTION_STATUSES } from "@/lib/correction-repository";

export async function updateCorrectionStatus(formData: FormData) {
  await requireAdminAuth();

  if (!process.env.MONGODB_URI) {
    throw new Error("Correction review requires a MongoDB connection.");
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as CorrectionRequestStatus;

  if (!id.trim() || !VALID_CORRECTION_STATUSES.has(status)) {
    throw new Error("Invalid correction request update.");
  }

  await updateCorrectionRequestStatus(id, status);
  revalidatePath("/admin/corrections");
}
