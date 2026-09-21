'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Fires a lightweight page-view beacon to /api/analytics on every route change.
 * Skips admin/api paths.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return
    const controller = new AbortController()
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {})
    return () => controller.abort()
  }, [pathname])

  return null
}
