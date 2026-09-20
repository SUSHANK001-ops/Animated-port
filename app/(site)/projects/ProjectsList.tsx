'use client'
import React from 'react'
import type { Project } from '@/data/config'
import ProjectCard from '../../ui/ProjectCard'
import { useGsapReveal } from '../../ui/useGsapReveal'

const ProjectsList = ({ projects }: { projects: Project[] }) => {
  const gridRef = useGsapReveal<HTMLDivElement>({ stagger: 0.1 })

  return (
    <div ref={gridRef} className="grid grid-cols-1 gap-6 pb-24 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.number} project={project} />
      ))}
    </div>
  )
}

export default ProjectsList
