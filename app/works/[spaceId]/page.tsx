import { redirect } from "next/navigation";

export default async function LegacyWorkDetailPage({
  params,
}: PageProps<"/works/[spaceId]">) {
  const { spaceId } = await params;

  redirect(`/events/${spaceId}`);
}
