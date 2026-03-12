import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectDialog } from '@/components/dialog/ProjectDialog'
import type { Project } from '@/types/project'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock framer-motion AnimatePresence to render children immediately
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  }
})

const mockProject: Project = {
  id: 'test-1',
  name: 'Test Project',
  desc: 'A test project description',
  tech: ['React', 'TypeScript'],
  screenshotUrl: '',
  planet: 'mars',
}

describe('ProjectDialog', () => {
  it('renders project name when project is provided', () => {
    const onClose = vi.fn()
    render(<ProjectDialog project={mockProject} onClose={onClose} />)
    expect(screen.getByText('Test Project')).toBeDefined()
  })

  it('renders nothing when project is null', () => {
    const onClose = vi.fn()
    const { container } = render(<ProjectDialog project={null} onClose={onClose} />)
    expect(container.firstChild).toBeNull()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<ProjectDialog project={mockProject} onClose={onClose} />)
    const closeBtn = screen.getByLabelText('close')
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalled()
  })
})
