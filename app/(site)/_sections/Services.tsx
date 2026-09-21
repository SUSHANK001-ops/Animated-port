'use client'
import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { services } from '@/data/config'
import SectionHeader from '../../ui/SectionHeader'
import Sticker from '../../ui/Sticker'
import { useGsapReveal } from '../../ui/useGsapReveal'

const Services = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const listRef = useGsapReveal<HTMLDivElement>({ stagger: 0.08 })

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
      <div className="mb-14 flex items-start justify-between gap-4">
        <SectionHeader label="What I Do" title="Services" />
        <Sticker name="rocket" size={72} float className="hidden shrink-0 sm:block" />
      </div>

      <div ref={listRef} className="border-t border-border">
        {services.map((service, i) => {
          const open = openIndex === i
          return (
            <div key={service.number} className="border-b border-border">
              <button
                onClick={() => setOpenIndex(open ? null : i)}
                className="group flex w-full items-center gap-5 py-6 text-left"
                aria-expanded={open}
              >
                <span className="font-mono text-sm text-muted">[ {service.number} ]</span>
                <span
                  className={`flex-1 text-xl font-semibold transition-colors md:text-3xl ${
                    open ? 'text-accent' : 'text-foreground group-hover:text-foreground/70'
                  }`}
                >
                  {service.title}
                </span>
                <Plus
                  size={20}
                  className={`shrink-0 text-muted transition-transform duration-300 ${
                    open ? 'rotate-45 text-accent' : ''
                  }`}
                />
              </button>

              {/* Expandable body */}
              <div
                className="grid transition-all duration-300 ease-out"
                style={{
                  gridTemplateRows: open ? '1fr' : '0fr',
                  opacity: open ? 1 : 0,
                }}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-6 pb-8 md:grid-cols-2">
                    <div>
                      <p className="text-sm leading-relaxed text-muted">
                        {service.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <pre className="overflow-x-auto rounded-xl border border-border bg-[#0d0d0d] p-4 font-mono text-xs leading-relaxed text-accent">
                      {service.snippet}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Services
