'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import { projects } from '@/data/config'
import { Block } from '../../ui/editorial'

const FALLBACK = '/assests/Placeholder.png'

const ProjectsGrid = () => {
  // Show a short curated preview on the home page.
  const preview = projects.slice(0, 4)

  return (
    <div className="editorial-page" id="featured">
      <Block label="Selected work" title="Featured Projects">
        <div className="space-y-1">
          {preview.map((project) => {
            const href = project.liveUrl ?? project.githubUrl ?? '#'
            return (
              <a
                key={project.number}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-click-sound
                className="feat-row group"
              >
                <Image
                  src={project.image ?? FALLBACK}
                  alt={project.title}
                  width={96}
                  height={68}
                  className="feat-thumb"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium text-foreground">{project.title}</h3>
                    {project.liveUrl && (
                      <ArrowUpRight
                        size={14}
                        className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                      />
                    )}
                    {!project.liveUrl && project.githubUrl && (
                      <Github size={13} className="shrink-0 text-muted" />
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {project.tagline ?? project.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.builtWith.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border px-2 py-0.5 text-[0.68rem] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
        <Link
          href="/projects"
          data-click-sound
          className="group mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          All projects
          <ArrowRight size={15} className="arrow-slide" />
        </Link>
      </Block>
    </div>
  )
}

export default ProjectsGrid
