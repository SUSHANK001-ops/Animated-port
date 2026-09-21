'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { projects } from '@/data/config'
import ProjectCard from '../../ui/ProjectCard'
import { Block } from '../../ui/editorial'

const ProjectsGrid = () => {
  // Show a short curated preview on the home page.
  const preview = projects.slice(0, 3)

  return (
    <div className="editorial">
      <Block label="Selected work" title="Projects">
        <div className="space-y-4">
          {preview.map((project) => (
            <ProjectCard key={project.number} project={project} />
          ))}
        </div>
        <Link
          href="/projects"
          data-click-sound
          className="group mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          All projects
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Block>
    </div>
  )
}

export default ProjectsGrid
