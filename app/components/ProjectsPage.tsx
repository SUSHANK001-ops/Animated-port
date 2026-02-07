'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: 'SenChat',
    description:
      'A real-time chatting application with instant messaging, user authentication, and a sleek conversational UI. Built as a full-stack project with modern web technologies.',
    tags: ['MERN Stack', 'Socket.io', 'Real-time', 'Authentication'],
    color: '#00ff88',
    liveUrl: 'https://senchat.sushanka.com.np',
    githubUrl: '',
    featured: true,
  },
  {
    title: 'SenBlog',
    description:
      'A full-stack blogging platform with rich text editing, user dashboards, and content management. Features responsive design, authentication, and a clean reading experience.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
    color: '#00d4ff',
    liveUrl: 'https://senblog.vercel.app/',
    githubUrl: '',
    featured: true,
  },
  {
    title: 'SenTools',
    description:
      'A comprehensive utility toolkit web app with multiple developer and productivity tools built into a single platform. Clean UI with intuitive navigation.',
    tags: ['Next.js', 'JavaScript', 'Tailwind CSS'],
    color: '#E9A8F2',
    liveUrl: 'https://sentools.vercel.app/',
    githubUrl: 'https://github.com/SUSHANK001-ops/SenTOols.git',
    featured: true,
  },
]

const ProjectsPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const projectRefs = useRef<HTMLDivElement[]>([])
  const [activeProject, setActiveProject] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Project cards
      projectRefs.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: i % 2 === 0 ? -100 : 100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative min-h-screen w-full py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute top-0 right-1/4 w-125 h-125 bg-cyan-500/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-125 h-125 bg-green-500/3 rounded-full blur-3xl pointer-events-none" />

      {/* Heading */}
      <div ref={headingRef} className="text-center mb-20">
        <p className="text-sm md:text-base uppercase tracking-[0.3em] text-neutral-500 mb-4 font-mono">
          Featured Work
        </p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="text-green-400">
            Projects
          </span>
        </h2>
        <div className="mx-auto mt-6 h-0.5 w-24 bg-green-400" />
      </div>

      {/* Projects List */}
      <div className="max-w-6xl mx-auto space-y-8">
        {projects.map((project, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) projectRefs.current[index] = el
            }}
            className={`group relative rounded-2xl border transition-all duration-500 overflow-hidden
              ${activeProject === index
                ? 'border-white/20 bg-white/5'
                : 'border-white/5 bg-white/2 hover:border-white/10'
              }`}
            onMouseEnter={() => setActiveProject(index)}
            onMouseLeave={() => setActiveProject(null)}
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 0% 50%, ${project.color}08, transparent 50%)`,
              }}
            />

            <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
              {/* Project Number */}
              <div className="shrink-0">
                <span
                  className="text-7xl md:text-8xl font-bold leading-none transition-colors duration-500"
                  style={{
                    color: activeProject === index ? project.color : 'rgba(255,255,255,0.05)',
                    WebkitTextStroke: activeProject === index ? 'none' : `1px rgba(255,255,255,0.1)`,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    {project.featured && (
                      <span
                        className="inline-block text-xs font-mono uppercase tracking-wider mb-2 px-3 py-1 rounded-full"
                        style={{
                          color: project.color,
                          backgroundColor: `${project.color}15`,
                          border: `1px solid ${project.color}30`,
                        }}
                      >
                        Featured
                      </span>
                    )}
                    <h3 className="text-2xl md:text-3xl font-bold text-white/90 group-hover:text-white transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>

                  {/* Links */}
                  <div className="flex gap-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center
                                   hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                        aria-label="View source code"
                      >
                        <Github size={16} className="text-neutral-400" />
                      </a>
                    )}
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center
                                 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                      aria-label="View live project"
                    >
                      <ExternalLink size={16} className="text-neutral-400" />
                    </a>
                  </div>
                </div>

                {/* Description */}
                <p className="text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300 leading-relaxed mb-6 max-w-2xl">
                  {project.description}
                </p>

                {/* Tags & CTA */}
                <div className="flex flex-wrap items-center gap-3">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-neutral-500
                                 group-hover:text-neutral-300 group-hover:border-white/15 transition-all duration-300 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                  <div className="ml-auto hidden md:flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0"
                    style={{ color: project.color }}
                  >
                    <span>View Project</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom accent line */}
            <div
              className="h-px w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
              style={{
                background: `${project.color}30`,
              }}
            />
          </div>
        ))}
      </div>

      {/* View all CTA */}
      <div className="text-center mt-16">
        <a
          href="https://github.com/SUSHANK001-ops"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 text-neutral-300
                     hover:border-white/25 hover:text-white hover:bg-white/5 transition-all duration-300 group"
        >
          <span className="font-mono text-sm">View All on GitHub</span>
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  )
}

export default ProjectsPage
