'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AccessibilityContextType {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  toggleHighContrast: () => void
  toggleLargeText: () => void
  toggleReducedMotion: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  toggleHighContrast: () => {},
  toggleLargeText: () => {},
  toggleReducedMotion: () => {}
})

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setHighContrast(settings.highContrast || false)
      setLargeText(settings.largeText || false)
      setReducedMotion(settings.reducedMotion || false)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('accessibility', JSON.stringify({
      highContrast,
      largeText,
      reducedMotion
    }))

    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }

    if (largeText) {
      document.documentElement.classList.add('large-text')
    } else {
      document.documentElement.classList.remove('large-text')
    }

    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion')
    } else {
      document.documentElement.classList.remove('reduced-motion')
    }
  }, [highContrast, largeText, reducedMotion])

  const toggleHighContrast = () => setHighContrast(prev => !prev)
  const toggleLargeText = () => setLargeText(prev => !prev)
  const toggleReducedMotion = () => setReducedMotion(prev => !prev)

  return (
    <AccessibilityContext.Provider value={{
      highContrast,
      largeText,
      reducedMotion,
      toggleHighContrast,
      toggleLargeText,
      toggleReducedMotion
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
