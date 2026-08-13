import { notFound } from "next/navigation";
import { EventDetail } from "@/components/events/event-detail";
import {
  getCurrentExhibition,
  getPublishedSpaces,
  getSpaceById,
} from "@/lib/exhibition-service";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/events/[eventId]">) {
  const { eventId } = await params;
  const exhibition = await getCurrentExhibition();
  const event = getSpaceById(exhibition, eventId);

  if (!event) {
    return {
      title: "Event not found | Month in History Wall",
    };
  }

  return {
    title: `${event.title} | Month in History Wall`,
    description: event.description,
  };
}

export default async function EventDetailPage({
  params,
}: PageProps<"/events/[eventId]">) {
  const { eventId } = await params;
  const exhibition = await getCurrentExhibition();
  const event = getSpaceById(exhibition, eventId);

  if (!event || (event.status !== "occupied" && event.status !== "featured")) {
    notFound();
  }

  const publishedEvents = getPublishedSpaces(exhibition);
  const currentIndex = publishedEvents.findIndex(
    (publishedEvent) => publishedEvent.id === event.id,
  );

  return (
    <EventDetail
      currentPosition={currentIndex >= 0 ? currentIndex + 1 : 1}
      event={event}
      exhibition={exhibition}
      nextEvent={publishedEvents[currentIndex + 1]}
      previousEvent={publishedEvents[currentIndex - 1]}
      totalEvents={publishedEvents.length}
    />
  );
}
