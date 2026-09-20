import React from 'react'
import type { Metadata } from 'next'
import SectionHeader from '../../ui/SectionHeader'
import DashboardGrid from './DashboardGrid'

export const metadata: Metadata = {
  title: 'Dashboard · Sushanka Lamichhane',
  description: 'Live dashboard — GitHub activity, now playing, local time, and more.',
}

export default function DashboardPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-32 md:px-10 md:pt-40">
      <SectionHeader label="Live" title="Dashboard" className="mb-6" />
      <p className="mb-14 max-w-xl text-sm text-muted">
        A real-time look at what I&apos;m building, listening to, and learning.
      </p>

      <div className="pb-24">
        <DashboardGrid />
      </div>
    </section>
  )
}
