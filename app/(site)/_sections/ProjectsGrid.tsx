'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { projects } from '@/data/config'
import SectionHeader from '../../ui/SectionHeader'
import ProjectCard from '../../ui/ProjectCard'
import { useGsapReveal } from '../../ui/useGsapReveal'

const ProjectsGrid = () => {
  const gridRef = useGsapReveal<HTMLDivElement>({ stagger: 0.12 })

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
      <div className="mb-14 flex items-end justify-between gap-4">
        <SectionHeader label="My Projects" title="Projects" />
        <Link
          href="/projects"
          className="group hidden shrink-0 items-center gap-2 text-sm text-muted transition-colors hover:text-accent md:inline-flex"
        >
          View all
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.number} project={project} />
        ))}
      </div>
    </section>
  )
}

export default ProjectsGrid
