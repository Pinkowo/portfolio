import { fetchProjects } from "@/lib/notion";
import { SpaceJourneyPage } from "@/components/SpaceJourneyPage";

export const revalidate = 60;

const DEVELOPER_NAME = "Yi-Hsin, Li";
const CONTACT_HREF = "pinkowo057@gmail.com";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const projects = await fetchProjects(locale);

  return (
    <SpaceJourneyPage
      projects={projects}
      name={DEVELOPER_NAME}
      contactHref={CONTACT_HREF}
    />
  );
}
