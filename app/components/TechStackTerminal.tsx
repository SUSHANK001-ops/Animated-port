'use client'
import React, { useState, useEffect } from 'react'
import gsap from 'gsap'

const TechStackTerminal = () => {
  const [lines, setLines] = useState<string[]>([])
  const terminalRef = React.useRef<HTMLDivElement>(null)

  const techStack = [
    'Frontend: React, Next.js, JavaScript, TypeScript',
    'Styling: TailwindCSS, CSS Modules',
    '3D Graphics: Three.js',
    'Backend: Node.js, Express, Python, ',
    'Database: PostgreSQL, MongoDB',
    'Tools: Git, Docker, Git Actions',
  ]

  useEffect(() => {
    let currentLine = 0
    let currentChar = 0
    let isDeleting = false

    const typeEffect = () => {
      if (!isDeleting && currentLine < techStack.length) {
        // Typing
        if (currentChar < techStack[currentLine].length) {
          const newLines = [...lines]
          if (!newLines[currentLine]) {
            newLines[currentLine] = ''
          }
          newLines[currentLine] = techStack[currentLine].slice(0, currentChar + 1)
          setLines(newLines)
          currentChar++
          setTimeout(typeEffect, 120)
        } else {
          // Move to next line
          currentLine++
          currentChar = 0
          const newLines = [...lines]
          newLines.push('')
          setLines(newLines)
          setTimeout(typeEffect, 500)
        }
      } else if (!isDeleting && currentLine === techStack.length) {
        // Finished typing all lines, wait then reset for loop
        setTimeout(() => {
          currentLine = 0
          currentChar = 0
          setLines([])
          typeEffect()
        }, 1000)
      }
    }

    typeEffect()
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      gsap.fromTo(
        terminalRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1, delay: 1.5 }
      )
    }
  }, [])

  return (
    <div
      ref={terminalRef}
      className="hidden md:block fixed right-10 top-48 w-80 font-mono text-sm bg-black bg-opacity-70 backdrop-blur border border-green-500 border-opacity-50 rounded-lg p-6 shadow-2xl"
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-500 border-opacity-30">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-auto text-xs text-green-400 opacity-60">Tech Stack</span>
      </div>

      {/* Terminal Content */}
      <div className="space-y-2">
        <div className="text-green-400 opacity-75">$ whoami</div>
        <div className="text-green-400 opacity-75">Full Stack developer</div>
        <div className="text-green-400 opacity-75 mt-4">$ cat skills.txt</div>

        {/* Typed lines */}
        <div className="space-y-2 mt-4">
          {lines.map((line, index) => (
            <div key={index} className="text-cyan-400">
              {line}
              {index === lines.length - 1 && (
                <span className="animate-pulse ml-1">▎</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 opacity-0 blur -z-10 group-hover:opacity-10 transition-opacity"></div>
    </div>
  )
}

export default TechStackTerminal
