import React from 'react'
import type { Metadata } from 'next'
import Hero from './_sections/Hero'
import AboutCards from './_sections/AboutCards'
import Services from './_sections/Services'
import ProjectsGrid from './_sections/ProjectsGrid'
import Experience from './_sections/Experience'
import CertificationsTeaser from './_sections/CertificationsTeaser'

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
      <div className="section-divider" />
      <Services />
      <div className="section-divider" />
      <ProjectsGrid />
      <div className="section-divider" />
      <Experience />
      <div className="section-divider" />
      <CertificationsTeaser />
    </>
  )
}
