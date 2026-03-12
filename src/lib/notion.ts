import { Client } from '@notionhq/client'
import type { Project, PlanetKey } from '@/types/project'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? ''

// Fallback static data when Notion API is unavailable
const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'fallback-1',
    name: 'Project Alpha',
    desc: 'A sample project — update via Notion',
    tech: ['Next.js', 'TypeScript'],
    screenshotUrl: '',
    planet: 'saturn',
  },
]

function extractRichText(prop: any): string {
  if (!prop?.rich_text?.length) return ''
  return prop.rich_text.map((t: any) => t.plain_text).join('')
}

function extractMultiSelect(prop: any): string[] {
  if (!prop?.multi_select) return []
  return prop.multi_select.map((s: any) => s.name)
}

function extractUrl(prop: any): string | undefined {
  return prop?.url ?? undefined
}

function extractTitle(prop: any): string {
  if (!prop?.title?.length) return ''
  return prop.title.map((t: any) => t.plain_text).join('')
}

function extractSelect(prop: any): string {
  return prop?.select?.name ?? ''
}

function extractFile(prop: any): string {
  if (!prop?.files?.length) return ''
  const file = prop.files[0]
  return file?.file?.url ?? file?.external?.url ?? ''
}

export async function fetchProjects(): Promise<Project[]> {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    return FALLBACK_PROJECTS
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Planet',
        select: { is_not_empty: true },
      },
    })

    return response.results
      .map((page: any) => {
        const props = page.properties
        return {
          id: page.id,
          name: extractTitle(props['Name']),
          desc: extractRichText(props['Description']),
          tech: extractMultiSelect(props['Tech']),
          screenshotUrl: extractFile(props['Screenshot']) ?? extractUrl(props['ScreenshotUrl']) ?? '',
          demoUrl: extractUrl(props['DemoUrl']),
          githubUrl: extractUrl(props['GitHubUrl']),
          planet: extractSelect(props['Planet']).toLowerCase() as PlanetKey,
        } satisfies Project
      })
      .filter((p) => p.name)
  } catch (error) {
    console.error('[Notion] fetchProjects failed:', error)
    return FALLBACK_PROJECTS
  }
}
