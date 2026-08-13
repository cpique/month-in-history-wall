import { currentExhibition, type Exhibition, type ExhibitionSpace } from "./exhibition-data";
import type { ReservationDocument, SubmissionDocument } from "./domain-types";
import { getMediaUrl } from "./media-storage";
import { getMongoDb } from "./mongodb";

export async function getCurrentExhibition(): Promise<Exhibition> {
  if (!process.env.MONGODB_URI) {
    return currentExhibition;
  }

  const db = await getMongoDb();
  const reservations = await db
    .collection<ReservationDocument>("reservations")
    .find({ status: "approved" })
    .toArray();

  if (reservations.length === 0) {
    return currentExhibition;
  }

  const reservationIds = reservations.map((reservation) => reservation._id);
  const submissions = await db
    .collection<SubmissionDocument>("submissions")
    .find({ reservationId: { $in: reservationIds }, reviewStatus: "approved" })
    .toArray();
  const submissionByReservationId = new Map(
    submissions.map((submission) => [submission.reservationId, submission]),
  );
  const overlayBySpaceId = new Map<string, ExhibitionSpace>();

  for (const reservation of reservations) {
    const submission = submissionByReservationId.get(reservation._id);
    const template = currentExhibition.spaces.find(
      (space) => space.id === reservation.preferredSpaceId,
    );

    if (!submission || !template) {
      continue;
    }

    const mediaUrl = submission.media.assetKey
      ? getMediaUrl(submission.media.assetKey)
      : undefined;
    const mediaPreview: ExhibitionSpace["mediaPreview"] = template.mediaPreview
      ? {
          ...template.mediaPreview,
          mediaUrl,
          mediaAlt: submission.media.altText ?? submission.workTitle,
          caption: submission.workTitle,
        }
      : {
          alt: submission.media.altText ?? submission.workTitle,
          caption: submission.workTitle,
          shape: "square",
          pattern: "frames",
          background: "#f4f1ea",
          foreground: "#171411",
          marks: ["0%"],
          mediaUrl,
          mediaAlt: submission.media.altText ?? submission.workTitle,
        };

    overlayBySpaceId.set(template.id, {
      ...template,
      title: submission.workTitle,
      creator: submission.creatorName,
      status: "occupied",
      category: "Published work",
      medium: submission.media.kind,
      description: submission.description,
      externalUrl: submission.externalUrl,
      mediaPreview,
    });
  }

  return {
    ...currentExhibition,
    spaces: currentExhibition.spaces.map(
      (space) => overlayBySpaceId.get(space.id) ?? space,
    ),
  };
}

export function getPublishedSpaces(exhibition: Exhibition) {
  return exhibition.spaces.filter(
    (space) => space.status === "occupied" || space.status === "featured",
  );
}

export function getSpaceById(exhibition: Exhibition, spaceId: string) {
  return exhibition.spaces.find((space) => space.id === spaceId);
}
