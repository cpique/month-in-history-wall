import { redirect } from "next/navigation";

type LegacyWorkDetailPageProps = {
  params: Promise<{ spaceId: string }>;
};

export default async function LegacyWorkDetailPage({
  params,
}: LegacyWorkDetailPageProps) {
  const { spaceId } = await params;

  redirect(`/events/${spaceId}`);
}
