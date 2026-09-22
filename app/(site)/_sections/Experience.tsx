'use client'
import React from 'react'
import { experience } from '@/data/config'
import { Block } from '../../ui/editorial'

const Experience = () => {
  return (
    <div className="editorial-page" id="experience">
      <Block label="Journey" title="Experience">
        <div className="space-y-8">
          {experience.map((exp, i) => (
            <div key={i} className="border-l border-border pl-5">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-base font-semibold text-foreground">{exp.role}</h3>
                <span className="font-mono text-xs text-muted">{exp.date}</span>
              </div>
              <p className="mt-0.5 font-mono text-sm text-accent">{exp.company}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{exp.description}</p>
            </div>
          ))}
        </div>
      </Block>
    </div>
  )
}

export default Experience
