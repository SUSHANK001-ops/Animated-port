'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { certifications } from '@/data/config'
import SectionHeader from '../../ui/SectionHeader'
import CertCard from '../../ui/CertCard'
import { useGsapReveal } from '../../ui/useGsapReveal'

const CertificationsTeaser = () => {
  const gridRef = useGsapReveal<HTMLDivElement>({ stagger: 0.12 })
  const preview = certifications.slice(0, 3)

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
      <div className="mb-14 flex items-end justify-between gap-4">
        <SectionHeader label="Certified" title="Certifications" />
        <Link
          href="/certifications"
          className="group hidden shrink-0 items-center gap-2 text-sm text-muted transition-colors hover:text-accent md:inline-flex"
        >
          View all
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {preview.map((cert) => (
          <CertCard key={cert.name} cert={cert} />
        ))}
      </div>

      <Link
        href="/certifications"
        className="group mt-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent md:hidden"
      >
        View all
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </section>
  )
}

export default CertificationsTeaser
