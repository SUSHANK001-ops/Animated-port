import React from 'react'
import type { Metadata } from 'next'
import DashboardGrid from './DashboardGrid'

export const metadata: Metadata = {
  title: 'Dashboard · Sushanka Lamichhane',
  description: 'Live dashboard — GitHub activity, now playing, local time, and more.',
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-32 pb-24 md:pt-36">
      <p className="eyebrow eyebrow-dot mb-3">Live</p>
      <h1 className="display-serif text-4xl text-foreground md:text-5xl">
        Dashboard
      </h1>
      <p className="mt-4 max-w-xl text-[0.975rem] leading-relaxed text-muted">
        A real-time look at what I&apos;m building, listening to, and learning.
      </p>

      <div className="mt-10">
        <DashboardGrid />
      </div>
    </div>
  )
}
