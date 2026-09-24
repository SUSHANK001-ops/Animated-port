'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { certifications } from '@/data/config'
import CertCard from '../../ui/CertCard'
import { Block } from '../../ui/editorial'

const CertificationsTeaser = () => {
  const preview = certifications.slice(0, 3)

  return (
    <div className="editorial-page">
      <Block label="Certified" title="Certifications">
        <div className="space-y-3">
          {preview.map((cert) => (
            <CertCard key={cert.name} cert={cert} />
          ))}
        </div>
        <Link
          href="/certifications"
          data-click-sound
          className="group mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          All certifications
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Block>
    </div>
  )
}

export default CertificationsTeaser
