import React from 'react'
import { Award, ExternalLink } from 'lucide-react'
import type { Certification } from '@/data/config'

const CertCard = ({ cert }: { cert: Certification }) => {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/40">
      {/* Year badge */}
      <span className="absolute right-4 top-4 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 font-mono text-xs text-accent">
        {cert.year}
      </span>

      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-accent/10">
        <Award size={20} className="text-accent" />
      </div>

      <h3 className="pr-12 text-lg font-bold leading-snug text-foreground">{cert.name}</h3>
      <p className="mt-2 font-mono text-sm text-muted">{cert.issuer}</p>

      {cert.verifyUrl && (
        <a
          href={cert.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent"
        >
          Verify <ExternalLink size={12} />
        </a>
      )}
    </div>
  )
}

export default CertCard
