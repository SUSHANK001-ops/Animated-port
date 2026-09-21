import React from 'react'
import type { Metadata } from 'next'
import Hero from './_sections/Hero'
import AboutCards from './_sections/AboutCards'
import Services from './_sections/Services'
import ProjectsGrid from './_sections/ProjectsGrid'
import Experience from './_sections/Experience'
import CertificationsTeaser from './_sections/CertificationsTeaser'
import ScrollRibbon from '../ui/ScrollRibbon'

export const metadata: Metadata = {
  title: 'Sushanka Lamichhane – DevOps Engineer & Full-Stack Developer',
  description:
    'DevOps Engineer and Full-Stack Developer from Nepal. AWS · Docker · Kubernetes · Terraform · CI/CD · Red Hat Certified.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutCards />

      {/* Pinned reverse-U arc ribbon */}
      <ScrollRibbon
        text="I turn coffee into code, Google the rest, and act surprised when it actually works"
        outline
        fontSize={62}
      />

      <Services />
      <div className="section-divider" />
      <ProjectsGrid />

      {/* Second pinned arc ribbon (filled) */}
      <ScrollRibbon
        text="It works on my machine, so we ship it on a Friday and pray to the deploy gods"
        fontSize={62}
      />

      <Experience />
      <div className="section-divider" />
      <CertificationsTeaser />
    </>
  )
}
