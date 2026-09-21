import React from 'react'
import type { Metadata } from 'next'
import Guestbook from './Guestbook'

export const metadata: Metadata = {
  title: 'Guestbook · Sushanka Lamichhane',
  description: 'Leave a message. Say hi, drop feedback, or just wave.',
}

export default function GuestbookPage() {
  return (
    <div className="editorial pt-32 md:pt-40">
      <p className="eyebrow mb-3">Sign in</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
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
