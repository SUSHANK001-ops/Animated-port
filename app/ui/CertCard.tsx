import React from 'react'
import { ExternalLink } from 'lucide-react'
import type { Certification } from '@/data/config'

/** Calm editorial certification card. */
const CertCard = ({ cert }: { cert: Certification }) => {
  return (
    <article className="ed-card flex items-start justify-between gap-4">
      <div>
        <h3 className="text-[0.95rem] font-semibold leading-snug text-foreground">{cert.name}</h3>
        <p className="mt-1 font-mono text-xs text-muted">{cert.issuer}</p>
        {cert.verifyUrl && (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-click-sound
            className="mt-3 inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent"
          >
            Verify <ExternalLink size={12} />
          </a>
        )}
      </div>
      <span className="shrink-0 font-mono text-xs text-muted">{cert.year}</span>
    </article>
  )
}

export default CertCard
