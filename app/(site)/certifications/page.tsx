import React from 'react'
import type { Metadata } from 'next'
import { certifications } from '@/data/config'
import CertList from './CertList'

export const metadata: Metadata = {
  title: 'Certifications · Sushanka Lamichhane',
  description: 'Professional certifications in DevOps, cloud, and full-stack development.',
}

export default function CertificationsPage() {
  return (
    <div className="editorial pt-32 pb-24 md:pt-40">
      <p className="eyebrow mb-3">Certified</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Certifications
      </h1>
      <p className="mt-4 text-[0.975rem] leading-relaxed text-muted">
        Credentials earned across Linux, DevOps, and full-stack web development.
      </p>

      <div className="mt-10">
        <CertList certifications={certifications} />
      </div>
    </div>
  )
}
