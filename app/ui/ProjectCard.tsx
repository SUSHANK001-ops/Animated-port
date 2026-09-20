import React from 'react'
import { ArrowUpRight, Github } from 'lucide-react'
import type { Project } from '@/data/config'

/**
 * Project card: numbered, built-with tags (muted) + deployed-on tags (accent),
 * border glows on hover.
 */
const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/50 md:p-8">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <span className="font-mono text-sm text-muted">[{project.number}]</span>
        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-foreground"
              aria-label={`${project.title} source`}
            >
              <Github size={18} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
            >
              Live <ArrowUpRight size={15} />
            </a>
          )}
        </div>
      </div>

      {/* Title + desc */}
      <h3 className="mt-5 text-2xl font-bold text-foreground">{project.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>

      {/* Built with */}
      <div className="mt-6">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">
          Built with:
        </p>
        <div className="flex flex-wrap gap-2">
          {project.builtWith.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-3 py-1 font-mono text-xs text-foreground/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Deployed on */}
      {project.deployedOn && (
        <div className="mt-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            Deployed on:
          </p>
          <div className="flex flex-wrap gap-2">
            {project.deployedOn.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-accent/40 bg-accent/5 px-3 py-1 font-mono text-xs text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectCard
