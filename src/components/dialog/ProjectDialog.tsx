'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { X, Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [imgIndex, setImgIndex] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const t = useTranslations('dialog')

  const urls = project?.screenshotUrls ?? []
  const hasMultiple = urls.length > 1

  const prev = useCallback(() => setImgIndex((i) => (i - 1 + urls.length) % urls.length), [urls.length])
  const next = useCallback(() => setImgIndex((i) => (i + 1) % urls.length), [urls.length])

  // Reset index & loading state when project or image changes
  useEffect(() => { setImgIndex(0); setImgLoaded(false) }, [project?.id])
  useEffect(() => { setImgLoaded(false) }, [imgIndex])

  // Keyboard navigation
  useEffect(() => {
    if (!hasMultiple) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [hasMultiple, prev, next])

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
            {/* Left panel — screenshots or iframe */}
            <div className="relative flex-1 bg-black min-h-[40vh] md:min-h-0">
              {urls.length > 0 ? (
                <div className="relative w-full h-full">
                  {/* Rocket loading animation */}
                  <AnimatePresence>
                    {!imgLoaded && (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Rocket body */}
                            <path d="M32 6C32 6 22 20 22 38C22 44 26 48 32 48C38 48 42 44 42 38C42 20 32 6 32 6Z" fill="#E0E7FF" />
                            {/* Window */}
                            <circle cx="32" cy="28" r="4" fill="#3B82F6" />
                            <circle cx="32" cy="28" r="2.5" fill="#60A5FA" opacity="0.6" />
                            {/* Fins */}
                            <path d="M22 38L16 46L22 44Z" fill="#F97316" />
                            <path d="M42 38L48 46L42 44Z" fill="#F97316" />
                            {/* Flame */}
                            <motion.path
                              d="M28 48C28 48 30 58 32 58C34 58 36 48 36 48"
                              fill="#F97316"
                              animate={{ scaleY: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                              transition={{ duration: 0.3, repeat: Infinity }}
                            />
                            <motion.path
                              d="M30 48C30 48 31 54 32 54C33 54 34 48 34 48"
                              fill="#FDE68A"
                              animate={{ scaleY: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                              transition={{ duration: 0.25, repeat: Infinity }}
                            />
                          </svg>
                        </motion.div>
                        {/* Star particles */}
                        <div className="flex gap-2">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1 h-1 rounded-full bg-[#60A5FA]"
                              animate={{ opacity: [0.2, 1, 0.2] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.25 }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={imgIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: imgLoaded ? 1 : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={urls[imgIndex]}
                        alt={`${project.name} screenshot ${imgIndex + 1}`}
                        fill
                        className="object-contain"
                        onLoad={() => setImgLoaded(true)}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation arrows */}
                  {hasMultiple && (
                    <>
                      <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-colors"
                        aria-label="Previous screenshot"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-colors"
                        aria-label="Next screenshot"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Dots indicator */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                        {urls.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImgIndex(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              i === imgIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                            }`}
                            aria-label={`Go to screenshot ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : project.demoUrl && !iframeError ? (
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

              <p className="text-[#7A8AB4] text-sm leading-relaxed mb-5 whitespace-pre-line">{project.content}</p>

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
