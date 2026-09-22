'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, Github, Server } from 'lucide-react'
import { projects } from '@/data/config'
import Reveal from '../../ui/Reveal'

/**
 * Featured projects as a quiet list with a coloured thumbnail block, mirroring
 * the inspiration's "Featured Projects" rows.
 */
const thumbTint = ['bento-blue', 'bento-green', 'bento-yellow', 'bento-pink', 'bento-brown']

const FeaturedProjects = () => {
  const featured = projects.slice(0, 4)

  return (
    <div className="editorial">
      <Reveal>
        <p className="eyebrow mb-3">Selected work</p>
        <h2 className="serif-title serif-section mb-6">Featured projects</h2>
      </Reveal>

      <div className="space-y-3">
        {featured.map((p, i) => {
          const url = p.liveUrl || p.githubUrl || '#'
          return (
            <Reveal key={p.number} delay={i * 60}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                data-click-sound
                className="lift group flex items-center gap-4 rounded-2xl border border-border bg-surface p-3"
              >
                {/* Coloured thumb with initials */}
                <div
                  className={`grid h-14 w-20 shrink-0 place-items-center rounded-xl ${thumbTint[i % thumbTint.length]}`}
                >
                  <span className="serif-title text-lg text-foreground/80">
                    {p.title.slice(0, 2)}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[0.95rem] font-semibold text-foreground group-hover:text-link">
                      {p.title}
                    </h3>
                    {p.githubUrl && <Github size={13} className="shrink-0 text-muted" />}
                    {p.deployedOn && <Server size={13} className="shrink-0 text-muted" />}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted">{p.description}</p>
                </div>

                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                />
              </a>
            </Reveal>
          )
        })}
      </div>

      <Reveal>
        <Link
          href="/projects"
          data-click-sound
          className="group mt-6 inline-flex items-center gap-1.5 text-sm text-link"
        >
          <span className="link-quiet">All projects</span>
          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </Reveal>
    </div>
  )
}

export default FeaturedProjects
