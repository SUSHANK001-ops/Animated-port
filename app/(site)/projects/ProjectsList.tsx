'use client'
import React from 'react'
import type { Project } from '@/data/config'
import ProjectCard from '../../ui/ProjectCard'
import { useGsapReveal } from '../../ui/useGsapReveal'

const ProjectsList = ({ projects }: { projects: Project[] }) => {
  const listRef = useGsapReveal<HTMLDivElement>({ stagger: 0.08 })

  return (
    <div ref={listRef} className="space-y-4">
      {projects.map((project) => (
        <ProjectCard key={project.number} project={project} />
      ))}
    </div>
  )
}

export default ProjectsList
