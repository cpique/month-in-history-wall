import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { EventDetail } from "@/components/events/event-detail";
import { getPublishedEventDetailById } from "@/lib/exhibition-service";

export const dynamic = "force-dynamic";

type EventDetailPageProps = {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ correction?: string }>;
};

export async function generateMetadata({
  params,
}: EventDetailPageProps) {
  const { eventId } = await params;
  const detail = await getPublishedEventDetailById(eventId);

  if (!detail) {
    return {
      title: "Event not found | Month in History Wall",
    };
  }

  return {
    title: `${detail.event.title} | Month in History Wall`,
    description: detail.event.description,
  };
}

export default async function EventDetailPage({
  params,
  searchParams,
}: EventDetailPageProps) {
  const { eventId } = await params;
  const { correction } = await searchParams;
  const detail = await getPublishedEventDetailById(eventId);

  if (!detail) {
    notFound();
  }

  const host = (await headers()).get("host") ?? "month-in-history-wall.local";
  const protocol = host.includes("localhost") ? "http" : "https";
  const shareUrl = `${protocol}://${host}/events/${eventId}`;

  return (
    <EventDetail
      correctionStatus={typeof correction === "string" ? correction : undefined}
      currentPosition={detail.currentIndex + 1}
      event={detail.event}
      exhibition={detail.exhibition}
      nextEvent={detail.publishedEvents[detail.currentIndex + 1]}
      previousEvent={detail.publishedEvents[detail.currentIndex - 1]}
      relatedEvents={detail.relatedEvents}
      shareUrl={shareUrl}
      totalEvents={detail.publishedEvents.length}
    />
  );
}
