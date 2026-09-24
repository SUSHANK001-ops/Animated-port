'use client'
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from './theme/ThemeProvider'
import { SoundProvider } from './sound/SoundProvider'
import AnalyticsTracker from './AnalyticsTracker'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <SoundProvider>
          <AnalyticsTracker />
          {children}
        </SoundProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
