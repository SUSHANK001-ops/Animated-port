import React from 'react'
import type { Metadata } from 'next'
import { projects } from '@/data/config'
import ProjectsList from './ProjectsList'

export const metadata: Metadata = {
  title: 'Projects · Sushanka Lamichhane',
  description: 'Selected projects across DevOps, cloud infrastructure, and full-stack development.',
}

export default function ProjectsPage() {
  return (
    <div className="editorial pt-32 pb-24 md:pt-40">
      <p className="eyebrow mb-3">Selected work</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Projects
      </h1>
      <p className="mt-4 text-[0.975rem] leading-relaxed text-muted">
        A selection of things I&apos;ve built and shipped — from multi-tier cloud deployments to
        full-stack web apps.
      </p>

      <div className="mt-10">
        <ProjectsList projects={projects} />
      </div>
    </div>
  )
}
