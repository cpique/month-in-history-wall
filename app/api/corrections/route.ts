import { NextResponse, type NextRequest } from "next/server";
import { insertCorrectionRequest } from "@/lib/correction-repository";
import { getPublishedEventDetailById } from "@/lib/exhibition-service";

export const dynamic = "force-dynamic";

function eventRedirect(request: NextRequest, eventId: string, status: string) {
  const url = new URL(`/events/${encodeURIComponent(eventId)}`, request.url);
  url.searchParams.set("correction", status);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const eventId = String(formData.get("eventId") ?? "");
  const message = String(formData.get("message") ?? "");
  const sourceUrl = String(formData.get("sourceUrl") ?? "");
  const contactEmail = String(formData.get("contactEmail") ?? "");
  const website = String(formData.get("website") ?? "");

  if (!eventId.trim()) {
    return NextResponse.redirect(new URL("/?correction=invalid", request.url), {
      status: 303,
    });
  }

  if (website.trim()) {
    return eventRedirect(request, eventId, "received");
  }

  const detail = await getPublishedEventDetailById(eventId);

  if (!detail) {
    return eventRedirect(request, eventId, "invalid");
  }

  if (!process.env.MONGODB_URI) {
    return eventRedirect(request, eventId, "unavailable");
  }

  try {
    await insertCorrectionRequest({
      eventId,
      monthSlug: detail.exhibition.slug,
      message,
      sourceUrl,
      contactEmail,
    });
  } catch {
    return eventRedirect(request, eventId, "invalid");
  }

  return eventRedirect(request, eventId, "received");
}
