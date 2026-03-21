import { Client } from '@notionhq/client'
import type { Project, PlanetKey } from '@/types/project'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? ''

// Fallback static data when Notion API is unavailable
const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'fallback-saturn',
    name: 'Analytics Dashboard',
    highlight: 'Real-time data visualization platform with customizable widgets, multi-source data ingestion, and role-based access control.',
    content: '',
    tech: ['Next.js', 'Tailwind', 'Recharts', 'Prisma'],
    screenshotUrl: '',
    planet: 'saturn',
  },
  {
    id: 'fallback-moon',
    name: 'Design System v2',
    highlight: '60+ accessible UI components with comprehensive Storybook documentation, dark mode, and TypeScript-first API.',
    content: '',
    tech: ['React', 'TypeScript', 'Storybook', 'Rollup'],
    screenshotUrl: '',
    planet: 'moon',
  },
  {
    id: 'fallback-jupiter',
    name: 'Collab Editor',
    highlight: 'Conflict-free real-time collaborative document editor supporting any concurrency level using CRDT algorithms.',
    content: '',
    tech: ['Vue', 'Node.js', 'WebSockets', 'Yjs'],
    screenshotUrl: '',
    planet: 'jupiter',
  },
  {
    id: 'fallback-mars',
    name: 'Mobile Tracker',
    highlight: 'Cross-platform habit tracker with streak analytics, reminders, and smooth gesture-driven interactions.',
    content: '',
    tech: ['React Native', 'SQLite', 'Reanimated 3'],
    screenshotUrl: '',
    planet: 'mars',
  },
  {
    id: 'fallback-uranus',
    name: 'E-Commerce Platform',
    highlight: 'Headless commerce solution with server components, edge caching, and sub-100ms time-to-interactive.',
    content: '',
    tech: ['Next.js', 'Shopify', 'GraphQL', 'Vercel'],
    screenshotUrl: '',
    planet: 'uranus',
  },
  {
    id: 'fallback-neptune',
    name: 'DevOps Pipeline',
    highlight: 'Zero-downtime CI/CD pipeline with automated testing, canary deployments, and Slack alerting.',
    content: '',
    tech: ['Docker', 'GitHub Actions', 'Terraform', 'AWS'],
    screenshotUrl: '',
    planet: 'neptune',
  },
  {
    id: 'fallback-venus',
    name: 'AI Writing Tool',
    highlight: 'Context-aware writing assistant with streaming responses, custom personas, and usage analytics.',
    content: '',
    tech: ['Next.js', 'OpenAI API', 'Supabase', 'Vercel AI'],
    screenshotUrl: '',
    planet: 'venus',
  },
  {
    id: 'fallback-mercury',
    name: 'Portfolio Site',
    highlight: 'This very site — a scroll-driven space journey built with Framer Motion, Next.js, and Notion as CMS.',
    content: '',
    tech: ['Next.js', 'Framer Motion', 'Tailwind', 'Notion'],
    screenshotUrl: '',
    planet: 'mercury',
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

export async function fetchProjects(locale: string = 'zh-TW'): Promise<Project[]> {
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
          name: (locale === 'en' && extractRichText(props['Name-en'])) || extractTitle(props['Name']),
          highlight: (locale === 'en' && extractRichText(props['Highlight-en'])) || extractRichText(props['Highlight']),
          content: (locale === 'en' && extractRichText(props['Content-en'])) || extractRichText(props['Content']),
          tech: extractRichText(props['TechStack']).split('·').map((s: string) => s.trim()).filter(Boolean),
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
