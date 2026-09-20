import React from 'react'
import type { Metadata } from 'next'
import { projects } from '@/data/config'
import SectionHeader from '../../ui/SectionHeader'
import ProjectsList from './ProjectsList'

export const metadata: Metadata = {
  title: 'Projects · Sushanka Lamichhane',
  description: 'Selected projects across DevOps, cloud infrastructure, and full-stack development.',
}

export default function ProjectsPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-32 md:px-10 md:pt-40">
      <SectionHeader
        label="My Projects"
        title="Projects"
        className="mb-6"
      />
      <p className="mb-14 max-w-xl text-sm text-muted">
        A selection of things I&apos;ve built and shipped — from multi-tier cloud
        deployments to full-stack web apps.
      </p>

      <ProjectsList projects={projects} />
    </section>
  )
}
