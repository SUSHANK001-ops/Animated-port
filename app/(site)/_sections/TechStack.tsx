'use client'
import React from 'react'
import Image from 'next/image'
import { Block } from '../../ui/editorial'

// Vector logos downloaded to /public/tech.
const stack = [
  { src: '/tech/aws.svg', label: 'AWS' },
  { src: '/tech/docker.svg', label: 'Docker' },
  { src: '/tech/kubernetes.svg', label: 'Kubernetes' },
  { src: '/tech/terraform.svg', label: 'Terraform' },
  { src: '/tech/linux.svg', label: 'Linux' },
  { src: '/tech/git.svg', label: 'Git' },
  { src: '/tech/react.svg', label: 'React' },
  { src: '/tech/nextjs.svg', label: 'Next.js' },
  { src: '/tech/typescript.svg', label: 'TypeScript' },
  { src: '/tech/nodejs.svg', label: 'Node.js' },
  { src: '/tech/postgresql.svg', label: 'PostgreSQL' },
  { src: '/tech/python.svg', label: 'Python' },
]

const TechStack = () => {
  return (
    <div className="editorial-page">
      <Block label="Toolbox" title="Tech I work with">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {stack.map((t) => (
            <div
              key={t.label}
              title={t.label}
              className="group flex flex-col items-center gap-2 rounded-xl border border-transparent p-3 transition-all hover:border-border hover:bg-surface"
            >
              <Image
                src={t.src}
                alt={t.label}
                width={34}
                height={34}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                style={{ width: 34, height: 34 }}
              />
              <span className="text-[0.65rem] text-muted opacity-0 transition-opacity group-hover:opacity-100">
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </Block>
    </div>
  )
}

export default TechStack
