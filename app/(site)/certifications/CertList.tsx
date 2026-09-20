'use client'
import React from 'react'
import type { Certification } from '@/data/config'
import CertCard from '../../ui/CertCard'
import { useGsapReveal } from '../../ui/useGsapReveal'

const CertList = ({ certifications }: { certifications: Certification[] }) => {
  const gridRef = useGsapReveal<HTMLDivElement>({ stagger: 0.08 })

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3"
    >
      {certifications.map((cert) => (
        <CertCard key={cert.name} cert={cert} />
      ))}
    </div>
  )
}

export default CertList
