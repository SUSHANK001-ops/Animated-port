import React from 'react'
import type { Metadata } from 'next'
import SectionHeader from '../../ui/SectionHeader'
import Guestbook from './Guestbook'

export const metadata: Metadata = {
  title: 'Guestbook · Sushanka Lamichhane',
  description: 'Leave a message. Say hi, drop feedback, or just wave.',
}

export default function GuestbookPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-32 md:px-10 md:pt-40">
      <SectionHeader label="Sign In" title="Guestbook" className="mb-6" />
      <p className="mb-12 text-sm text-muted">
        Leave a message — a hello, some feedback, or just proof you were here.
      </p>

      <Guestbook />
    </section>
  )
}
