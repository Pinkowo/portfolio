import { fetchProjects } from '@/lib/notion'
import { SpaceJourneyPage } from '@/components/SpaceJourneyPage'

export const revalidate = 60

// TODO: Replace with your name and contact email
const DEVELOPER_NAME = 'Your Name'
const CONTACT_HREF = 'mailto:hello@example.com'

export default async function HomePage() {
  const projects = await fetchProjects()

  return (
    <SpaceJourneyPage
      projects={projects}
      name={DEVELOPER_NAME}
      contactHref={CONTACT_HREF}
    />
  )
}
