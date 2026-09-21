'use client'
import React from 'react'
import { Download } from 'lucide-react'
import { identity, stats } from '@/data/config'
import { Block, Card } from '../../ui/editorial'

const AboutCards = () => {
  return (
    <div className="editorial">
      <Block label="About" title="A little about me">
        <div className="prose-calm space-y-4">
          {identity.bio.map((line, i) => (
            <p key={i} className="text-[0.975rem]">
              {line}
            </p>
          ))}
        </div>

        <a
          href={identity.resume}
          download
          data-click-sound
          className="mt-6 inline-flex items-center gap-2 text-sm text-accent transition-opacity hover:opacity-80"
        >
          <Download size={15} /> Download résumé
        </a>

        {/* Quiet stat row */}
        <Card className="mt-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                <p className="eyebrow mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </Block>
    </div>
  )
}

export default AboutCards
