'use client'
import React from 'react'
import { usePathname } from 'next/navigation'

/**
 * Lightweight, non-blocking page transition. Re-keys on pathname so the CSS
 * fade-in replays on every route change. No loader, no content blocking.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div key={pathname} className="page-fade-in">
      {children}
    </div>
  )
}
