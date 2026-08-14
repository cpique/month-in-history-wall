import { notFound } from "next/navigation";
import { EventDetail } from "@/components/events/event-detail";
import { getPublishedEventDetailById } from "@/lib/exhibition-service";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/events/[eventId]">) {
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
}: PageProps<"/events/[eventId]">) {
  const { eventId } = await params;
  const { correction } = await searchParams;
  const detail = await getPublishedEventDetailById(eventId);

  if (!detail) {
    notFound();
  }

  return (
    <EventDetail
      correctionStatus={typeof correction === "string" ? correction : undefined}
      currentPosition={detail.currentIndex + 1}
      event={detail.event}
      exhibition={detail.exhibition}
      nextEvent={detail.publishedEvents[detail.currentIndex + 1]}
      previousEvent={detail.publishedEvents[detail.currentIndex - 1]}
      totalEvents={detail.publishedEvents.length}
    />
  );
}
