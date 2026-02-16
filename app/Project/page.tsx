'use client'
import React from 'react'
import { ExternalLink, Github } from 'lucide-react'

const projects = [
  {
    title: 'SenChat',
    description:
      'A real-time chatting application with instant messaging, user authentication, and a sleek conversational UI.',
    tags: ['MERN Stack', 'Socket.io', 'Real-time', 'Authentication'],
    color: '#FF6B8A',
    liveUrl: 'https://senchat.sushanka.com.np',
    githubUrl: '',
    featured: true,
  },
  {
    title: 'SenBlog',
    description:
      'A full-stack blogging platform with rich text editing, user dashboards, and content management.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
    color: '#00d4ff',
    liveUrl: 'https://senblog.vercel.app/',
    githubUrl: '',
    featured: true,
  },
  {
    title: 'SenTools',
    description:
      'A comprehensive utility toolkit web app with multiple developer and productivity tools.',
    tags: ['Next.js', 'JavaScript', 'Tailwind CSS'],
    color: '#E9A8F2',
    liveUrl: 'https://sentools.vercel.app/',
    githubUrl: 'https://github.com/SUSHANK001-ops/SenTOols.git',
    featured: true,
  },
]

const ProjectCard = ({
  project,
  index,
}: {
  project: (typeof projects)[0]
  index: number
}) => {
  const number = String(index + 1).padStart(2, '0')

  return (
    <div className="group relative w-[380px] h-[460px] bg-[#f0eded] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-500 hover:scale-[1.03] flex-shrink-0">
      {/* Large number */}
      <span
        className="absolute top-6 left-7 text-[5.5rem] font-black leading-none select-none"
        style={{ color: project.color, opacity: 0.7 }}
      >
        {number}
      </span>

      {/* Decorative circle */}
      <div
        className="absolute bottom-28 right-8 w-16 h-16 rounded-full opacity-20 transition-all duration-500 group-hover:scale-150 group-hover:opacity-30"
        style={{ border: `2px solid ${project.color}` }}
      />

      {/* Tags — visible on hover */}
      <div className="absolute top-7 right-7 flex flex-wrap gap-1.5 justify-end max-w-[180px] opacity-0 translate-y-2 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#1a1a1a] text-white/80"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-7">
        {/* Description — shown on hover */}
        <p className="text-[#555] text-xs leading-relaxed mb-3 opacity-0 translate-y-4 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
          {project.description}
        </p>

        {/* Title */}
        <h3 className="text-[#1a1a1a] text-[1.55rem] font-black uppercase leading-tight tracking-tight">
          {project.title}
        </h3>

        {/* Links — shown on hover */}
        <div className="flex gap-3 mt-3 opacity-0 translate-y-3 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a1a] hover:opacity-60 transition-opacity"
            >
              <ExternalLink size={13} />
              Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a1a] hover:opacity-60 transition-opacity"
            >
              <Github size={13} />
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <div className="min-h-screen w-screen bg-[#1a1a1a] flex items-center justify-center px-10 py-20">
      <div className="flex gap-8 flex-wrap justify-center">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </div>
  )
}

export default Page