'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code, Palette, Server, Smartphone, Zap, Globe } from 'lucide-react'
import { useSections } from './SectionContext' 

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: Code,
    title: 'Frontend Development',
    description: 'Crafting pixel-perfect, responsive interfaces with React, Next.js, and modern CSS frameworks that deliver exceptional user experiences.',
    color: '#00ff88',
    tags: ['React', 'Next.js', 'TypeScript'],
  },
  {
    icon: Server,
    title: 'Backend Development',
    description: 'Building scalable server-side architectures with Node.js, Express, and Python. REST APIs, authentication, and database design.',
    color: '#00d4ff',
    tags: ['Node.js', 'Express', 'Python'],
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Designing intuitive user journeys with wireframes, prototypes, and high-fidelity mockups that balance aesthetics with functionality.',
    color: '#FF8C00',
    tags: ['Figma', 'Prototyping', 'Design Systems'],
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    description: 'Ensuring seamless experiences across all devices with mobile-first approaches, fluid layouts, and adaptive components.',
    color: '#E9A8F2',
    tags: ['Mobile-First', 'Fluid Grids', 'Accessibility'],
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Supercharging web applications with lazy loading, code splitting, caching strategies, and Core Web Vitals optimization.',
    color: '#FFD700',
    tags: ['Lighthouse', 'Web Vitals', 'SEO'],
  },
  {
    icon: Globe,
    title: 'Full Stack Solutions',
    description: 'End-to-end development from database architecture to deployment pipelines. Docker, CI/CD, and cloud infrastructure.',
    color: '#FF6B6B',
    tags: ['Docker', 'CI/CD', 'AWS'],
  },
]

const ServicesPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { registerSection } = useSections();

  useEffect(() => {
    registerSection('services', sectionRef.current)
  }, [registerSection])

  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
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
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Glowing line
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Cards stagger animation
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 80,
            rotateX: 15,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
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
      id="services"
      className="relative min-h-screen w-full py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Heading */}
      <div ref={headingRef} className="text-center mb-20">
        <p className="text-sm md:text-base uppercase tracking-[0.3em] text-neutral-500 mb-4 font-mono">
          What I Do
        </p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="text-green-400">
            Services
          </span>
        </h2>
        <div
          ref={lineRef}
          className="mx-auto mt-6 h-0.5 w-24 bg-green-400 origin-center"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className="group relative p-8 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm
                         hover:border-white/15 transition-all duration-500 cursor-default overflow-hidden"
              style={{ perspective: '1000px' }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -8,
                  duration: 0.4,
                  ease: 'power2.out',
                })
                gsap.to(e.currentTarget.querySelector('.card-glow'), {
                  opacity: 0.15,
                  duration: 0.4,
                })
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  duration: 0.4,
                  ease: 'power2.out',
                })
                gsap.to(e.currentTarget.querySelector('.card-glow'), {
                  opacity: 0,
                  duration: 0.4,
                })
              }}
            >
              {/* Card glow */}
              <div
                className="card-glow absolute inset-0 opacity-0 rounded-2xl pointer-events-none"
                style={{
                  background: `${service.color}10`,
                }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 
                           border border-white/10 group-hover:border-white/20 transition-colors duration-300"
                style={{
                  background: `${service.color}10`,
                }}
              >
                <Icon
                  size={28}
                  style={{ color: service.color }}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-3 text-white/90 group-hover:text-white transition-colors duration-300">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300 mb-6">
                {service.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="text-xs px-3 py-1 rounded-full border border-white/10 text-neutral-500 
                               group-hover:text-neutral-300 group-hover:border-white/20 transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Corner accent */}
              <div
                className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `${service.color}08`,
                }}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ServicesPage