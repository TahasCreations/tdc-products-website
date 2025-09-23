'use client';

import { useEffect, useState } from 'react';

interface HeatmapData {
  x: number;
  y: number;
  timestamp: number;
  element: string;
  page: string;
  userId?: string;
}

interface HeatmapTrackerProps {
  enabled?: boolean;
  userId?: string;
  page?: string;
}

export default function HeatmapTracker({ 
  enabled = true, 
  userId,
  page = window.location.pathname 
}: HeatmapTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const startTracking = () => {
      setIsTracking(true);
      
      // Mouse click tracking
      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const heatmapData: HeatmapData = {
          x: event.clientX,
          y: event.clientY,
          timestamp: Date.now(),
          element: getElementSelector(target),
          page: page,
          userId: userId
        };

        sendHeatmapData(heatmapData);
      };

      // Mouse movement tracking (throttled)
      let lastMoveTime = 0;
      const handleMouseMove = (event: MouseEvent) => {
        const now = Date.now();
        if (now - lastMoveTime < 100) return; // Throttle to 10fps
        lastMoveTime = now;

        const target = event.target as HTMLElement;
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const heatmapData: HeatmapData = {
          x: event.clientX,
          y: event.clientY,
          timestamp: now,
          element: getElementSelector(target),
          page: page,
          userId: userId
        };

        sendHeatmapData(heatmapData, 'move');
      };

      // Scroll tracking
      let lastScrollTime = 0;
      const handleScroll = () => {
        const now = Date.now();
        if (now - lastScrollTime < 200) return; // Throttle scroll events
        lastScrollTime = now;

        const heatmapData: HeatmapData = {
          x: window.scrollX,
          y: window.scrollY,
          timestamp: now,
          element: 'scroll',
          page: page,
          userId: userId
        };

        sendHeatmapData(heatmapData, 'scroll');
      };

      // Event listeners
      document.addEventListener('click', handleClick, true);
      document.addEventListener('mousemove', handleMouseMove, true);
      window.addEventListener('scroll', handleScroll, true);

      return () => {
        document.removeEventListener('click', handleClick, true);
        document.removeEventListener('mousemove', handleMouseMove, true);
        window.removeEventListener('scroll', handleScroll, true);
        setIsTracking(false);
      };
    };

    const cleanup = startTracking();
    return cleanup;
  }, [enabled, userId, page]);

  const getElementSelector = (element: HTMLElement): string => {
    if (element.id) return `#${element.id}`;
    
    let selector = element.tagName.toLowerCase();
    
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        selector += '.' + classes.join('.');
      }
    }
    
    // Add position in parent
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(element);
      if (index > 0) {
        selector += `:nth-child(${index + 1})`;
      }
    }
    
    return selector;
  };

  const sendHeatmapData = async (data: HeatmapData, type: string = 'click') => {
    try {
      await fetch('/api/analytics/heatmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          type: type
        }),
      });
    } catch (error) {
      console.error('Heatmap data gönderilemedi:', error);
    }
  };

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        isTracking 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        {isTracking ? 'Heatmap Aktif' : 'Heatmap Pasif'}
      </div>
    </div>
  );
}
