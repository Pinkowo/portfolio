'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { X, Github, ExternalLink } from 'lucide-react'
import { TechTag } from '@/components/ui/TechTag'
import type { Project } from '@/types/project'
import Image from 'next/image'

interface ProjectDialogProps {
  project: Project | null
  onClose: () => void
}

export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const [iframeError, setIframeError] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const t = useTranslations('dialog')

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-4 md:inset-8 z-50 rounded-xl border border-[#1B3A6E] overflow-hidden flex flex-col md:flex-row"
            style={{ background: '#03050F', maxHeight: '90vh', maxWidth: '1200px', margin: 'auto' }}
            role="dialog"
            aria-modal
            aria-label={project.name}
          >
            {/* Left panel — iframe or image */}
            <div className="relative flex-1 bg-black min-h-[40vh] md:min-h-0">
              {project.demoUrl && !iframeError ? (
                <>
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <iframe
                    src={project.demoUrl}
                    className="w-full h-full border-0"
                    onLoad={() => setIframeLoaded(true)}
                    onError={() => setIframeError(true)}
                    title={project.name}
                    sandbox="allow-scripts allow-same-origin"
                  />
                </>
              ) : project.screenshotUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={project.screenshotUrl}
                    alt={project.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-[#7A8AB4] text-sm font-mono">
                  {t('iframeError')}
                </div>
              )}
            </div>

            {/* Right panel — details */}
            <div className="w-full md:w-[380px] flex flex-col p-6 overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-white font-sans font-bold text-xl leading-tight">{project.name}</h2>
                <button
                  onClick={onClose}
                  className="ml-3 p-1.5 rounded text-[#6B7BA4] hover:text-white hover:bg-[#1B3A6E] transition-colors"
                  aria-label={t('close')}
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-[#7A8AB4] text-sm leading-relaxed mb-5">{project.desc}</p>

              {project.tech.length > 0 && (
                <div className="mb-5">
                  <p className="text-[#6B7BA4] font-mono text-[10px] tracking-widest uppercase mb-2">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((tech) => (
                      <TechTag key={tech} label={tech} />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto flex flex-col gap-2">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-sans text-sm text-white transition-opacity hover:opacity-80"
                    style={{ background: '#F97316' }}
                  >
                    <ExternalLink size={15} />
                    {t('visitSite')}
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#1B3A6E] font-sans text-sm text-[#E0E7FF] transition-colors hover:border-[#3B82F6]"
                  >
                    <Github size={15} />
                    {t('viewCode')}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
