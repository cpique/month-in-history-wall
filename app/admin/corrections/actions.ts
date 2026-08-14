"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import type { CorrectionRequestStatus } from "@/lib/domain-types";
import { updateCorrectionRequestStatus } from "@/lib/correction-repository";

const statuses = new Set<CorrectionRequestStatus>([
  "open",
  "reviewing",
  "accepted",
  "rejected",
  "closed",
]);

async function requireAdminAuth() {
  if (
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    !process.env.CLERK_SECRET_KEY
  ) {
    return;
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }
}

export async function updateCorrectionStatus(formData: FormData) {
  await requireAdminAuth();

  if (!process.env.MONGODB_URI) {
    throw new Error("Correction review requires a MongoDB connection.");
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as CorrectionRequestStatus;

  if (!id.trim() || !statuses.has(status)) {
    throw new Error("Invalid correction request update.");
  }

  await updateCorrectionRequestStatus(id, status);
  revalidatePath("/admin/corrections");
}
