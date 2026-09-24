'use client'
import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { services } from '@/data/config'
import { Block } from '../../ui/editorial'

const Services = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="editorial-page" id="services">
      <Block label="What I do" title="Services">
        <div className="border-t border-border">
          {services.map((service, i) => {
            const open = openIndex === i
            return (
              <div key={service.number} className="border-b border-border">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  data-click-sound
                  className="group flex w-full items-center gap-4 py-4 text-left"
                  aria-expanded={open}
                >
                  <span className="font-mono text-xs text-muted">{service.number}</span>
                  <span
                    className={`flex-1 text-base font-medium transition-colors ${
                      open ? 'text-accent' : 'text-foreground group-hover:text-foreground/70'
                    }`}
                  >
                    {service.title}
                  </span>
                  <Plus
                    size={16}
                    className={`shrink-0 text-muted transition-transform duration-300 ${
                      open ? 'rotate-45 text-accent' : ''
                    }`}
                  />
                </button>

                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <div className="pb-5">
                      <p className="text-sm leading-relaxed text-muted">{service.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Block>
    </div>
  )
}

export default Services
