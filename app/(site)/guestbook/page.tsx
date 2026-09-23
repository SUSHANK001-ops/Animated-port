import React from 'react'
import type { Metadata } from 'next'
import Guestbook from './Guestbook'

export const metadata: Metadata = {
  title: 'Guestbook · Sushanka Lamichhane',
  description: 'Leave a message. Say hi, drop feedback, or just wave.',
}

export default function GuestbookPage() {
  return (
    <div className="editorial-page pt-32 md:pt-36">
      <p className="eyebrow eyebrow-dot mb-3">Sign in</p>
      <h1 className="display-serif text-4xl text-foreground md:text-5xl">
        Guestbook
      </h1>
      <p className="mt-4 text-[0.975rem] leading-relaxed text-muted">
        Leave a message — a hello, some feedback, or just proof you were here.
      </p>

      <div className="mt-10">
        <Guestbook />
      </div>
    </div>
  )
}
