'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  {
    year: '2025 - Present',
    role: 'Full Stack Developer',
    company: 'Freelance',
    description:
      'Delivering end-to-end web solutions for clients worldwide. Specializing in React/Next.js frontends, Node.js backends, and cloud deployments.',
    skills: ['Next.js', 'Node.js', 'MongoDB', 'PostgreSQL'],
    color: '#00ff88',
  },
  {
    year: 'Aug 2025 - Nov 2025',
    role: 'Web Developer Intern',
    company: 'Internship',
    description:
      'Built and maintained web applications using modern frameworks. Collaborated with teams on real-world projects, implemented features, and gained hands-on industry experience.',
    skills: ['React', 'Next.js', 'TailwindCSS', 'Git'],
    color: '#00d4ff',
  },
  {
    year: '2025 - Present',
    role: 'Frontend Developer',
    company: 'Project-Based',
    description:
      'Developed responsive web applications with a focus on performance, accessibility, and modern UI/UX principles. Collaborated with designers and backend teams.',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'GSAP'],
    color: '#FF8C00',
  },
  {
    year: '2025 - 2028 (Expected)',
    role: 'BSc IT Student',
    company: 'University',
    description:
      'Pursuing a Bachelor\'s degree in Information Technology with focus on programming, data structures, algorithms, and software engineering. Active in coding communities and building projects.',
    skills: ['Python', 'Java', 'DSA', 'Linux'],
    color: '#E9A8F2',
  },
]

const ExperiencePage = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<HTMLDivElement[]>([])
  const lineRef = useRef<HTMLDivElement>(null)

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

      // Timeline line grows
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: 1,
          },
        }
      )

      // Timeline items
      itemRefs.current.forEach((item, i) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: i % 2 === 0 ? -60 : 60,
            scale: 0.95,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
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
      id="experience"
      className="relative min-h-screen w-full py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-200 h-200 bg-cyan-500/3 rounded-full blur-3xl pointer-events-none" />

      {/* Heading */}
      <div ref={headingRef} className="text-center mb-20">
        <p className="text-sm md:text-base uppercase tracking-[0.3em] text-neutral-500 mb-4 font-mono">
          My Journey
        </p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="text-green-400">
            Experience
          </span>
        </h2>
        <div className="mx-auto mt-6 h-0.5 w-24 bg-green-400" />
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="relative max-w-4xl mx-auto">
        {/* Center line */}
        <div className="absolute left-4 md:left-1/2 md:-translate-x-[0.5px] top-0 bottom-0 w-px bg-white/5">
          <div
            ref={lineRef}
            className="absolute top-0 left-0 w-full h-full bg-green-400 origin-top"
          />
        </div>

        {/* Timeline Items */}
        <div className="space-y-12 md:space-y-16">
          {experiences.map((exp, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) itemRefs.current[index] = el
              }}
              className={`relative flex flex-col md:flex-row items-start gap-8 md:gap-0 
                ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Dot */}
              <div
                className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 z-10 mt-2"
                style={{
                  borderColor: exp.color,
                  backgroundColor: '#1A1A1A',
                  boxShadow: `0 0 12px ${exp.color}50`,
                }}
              />

              {/* Content Card */}
              <div
                className={`ml-12 md:ml-0 md:w-[45%] group 
                  ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}
              >
                <div
                  className="relative p-6 md:p-8 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm
                             hover:border-white/15 transition-all duration-500 overflow-hidden"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, { y: -4, duration: 0.3 })
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, { y: 0, duration: 0.3 })
                  }}
                >
                  {/* Glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 0% 0%, ${exp.color}08, transparent 60%)`,
                    }}
                  />

                  {/* Year badge */}
                  <span
                    className="inline-block text-xs font-mono uppercase tracking-wider mb-4 px-3 py-1 rounded-full"
                    style={{
                      color: exp.color,
                      backgroundColor: `${exp.color}10`,
                      border: `1px solid ${exp.color}25`,
                    }}
                  >
                    {exp.year}
                  </span>

                  {/* Role & Company */}
                  <h3 className="text-xl font-bold text-white/90 mb-1">{exp.role}</h3>
                  <p className="text-sm text-neutral-500 mb-4 font-mono">{exp.company}</p>

                  {/* Description */}
                  <p className="text-sm text-neutral-400 leading-relaxed mb-5">
                    {exp.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, si) => (
                      <span
                        key={si}
                        className="text-xs px-3 py-1 rounded-full border border-white/10 text-neutral-500
                                   group-hover:text-neutral-300 group-hover:border-white/20 transition-all duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spacer for opposite side */}
              <div className="hidden md:block md:w-[45%]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExperiencePage
