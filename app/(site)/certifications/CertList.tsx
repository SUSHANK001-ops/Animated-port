'use client'
import React from 'react'
import type { Certification } from '@/data/config'
import CertCard from '../../ui/CertCard'
import { useGsapReveal } from '../../ui/useGsapReveal'

const CertList = ({ certifications }: { certifications: Certification[] }) => {
  const listRef = useGsapReveal<HTMLDivElement>({ stagger: 0.06 })

  return (
    <div ref={listRef} className="space-y-3">
      {certifications.map((cert) => (
        <CertCard key={cert.name} cert={cert} />
      ))}
    </div>
  )
}

export default CertList
