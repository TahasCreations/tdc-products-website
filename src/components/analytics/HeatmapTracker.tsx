'use client'

import { useEffect } from 'react'

interface HeatmapTrackerProps {
  enabled: boolean
}

export default function HeatmapTracker({ enabled }: HeatmapTrackerProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const trackClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target) {
        const element = target.closest('[data-track]')
        if (element) {
          const trackData = element.getAttribute('data-track')
          console.log('Heatmap click tracked:', trackData, {
            x: event.clientX,
            y: event.clientY,
            element: element.tagName,
            className: element.className,
            id: element.id
          })
        }
      }
    }

    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      console.log('Scroll tracked:', scrollPercent + '%')
    }

    const trackTime = () => {
      const timeOnPage = Math.round((Date.now() - performance.timing.navigationStart) / 1000)
      console.log('Time on page tracked:', timeOnPage + 's')
    }

    document.addEventListener('click', trackClick)
    window.addEventListener('scroll', trackScroll)
    
    const timeInterval = setInterval(trackTime, 30000) // Every 30 seconds

    return () => {
      document.removeEventListener('click', trackClick)
      window.removeEventListener('scroll', trackScroll)
      clearInterval(timeInterval)
    }
  }, [enabled])

  return null
}
