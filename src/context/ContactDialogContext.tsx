'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface ContactDialogContextType {
  isOpen: boolean
  open: () => void
  close: () => void
}

const ContactDialogContext = createContext<ContactDialogContextType | null>(null)

export function ContactDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ContactDialogContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </ContactDialogContext.Provider>
  )
}

export function useContactDialog() {
  const ctx = useContext(ContactDialogContext)
  if (!ctx) throw new Error('useContactDialog must be used within ContactDialogProvider')
  return ctx
}
