'use client'
import React from 'react'
import { experience } from '@/data/config'
import SectionHeader from '../../ui/SectionHeader'
import { useGsapReveal } from '../../ui/useGsapReveal'

const Experience = () => {
  const listRef = useGsapReveal<HTMLDivElement>({ stagger: 0.15 })

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
      <SectionHeader label="Journey" title="Experience" className="mb-14" />

      <div ref={listRef} className="relative ml-3 border-l border-border pl-8 md:ml-4 md:pl-12">
        {experience.map((exp, i) => (
          <div key={i} className="relative pb-12 last:pb-0">
            {/* Node */}
            <span className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-background md:-left-[57px]" />

            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
              <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
              <span className="font-mono text-xs text-muted">{exp.date}</span>
            </div>
            <p className="mt-1 font-mono text-sm text-accent">{exp.company}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Experience
