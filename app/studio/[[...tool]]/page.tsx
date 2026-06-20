export default async function StudioPage({
  params,
}: {
  params: Promise<{ tool?: string[] }>;
}) {
  await params;
  return null;
}
