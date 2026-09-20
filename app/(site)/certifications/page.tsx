import React from 'react'
import type { Metadata } from 'next'
import { certifications } from '@/data/config'
import SectionHeader from '../../ui/SectionHeader'
import CertList from './CertList'

export const metadata: Metadata = {
  title: 'Certifications · Sushanka Lamichhane',
  description: 'Professional certifications in DevOps, cloud, and full-stack development.',
}

export default function CertificationsPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-32 md:px-10 md:pt-40">
      <SectionHeader label="Certified" title="Certifications" className="mb-6" />
      <p className="mb-14 max-w-xl text-sm text-muted">
        Credentials earned across Linux, DevOps, and full-stack web development.
      </p>

      <CertList certifications={certifications} />
    </section>
  )
}
