import { fetchProjects } from "@/lib/notion";
import { SpaceJourneyPage } from "@/components/SpaceJourneyPage";
import { PROFILE } from "@/lib/profile";

export const revalidate = 60;

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const projects = await fetchProjects(locale);

  return (
    <SpaceJourneyPage
      projects={projects}
      name={locale === 'en' ? PROFILE.nameEn : PROFILE.name}
    />
  );
}
