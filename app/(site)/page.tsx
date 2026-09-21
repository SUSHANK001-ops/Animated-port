import React from 'react'
import type { Metadata } from 'next'
import Hero from './_sections/Hero'
import AboutCards from './_sections/AboutCards'
import Services from './_sections/Services'
import ProjectsGrid from './_sections/ProjectsGrid'
import Experience from './_sections/Experience'
import CertificationsTeaser from './_sections/CertificationsTeaser'
import LatestBlog from './_sections/LatestBlog'

export const metadata: Metadata = {
  title: 'Sushanka Lamichhane – DevOps Engineer & Full-Stack Developer',
  description:
    'DevOps Engineer and Full-Stack Developer from Nepal. AWS · Docker · Kubernetes · Terraform · CI/CD · Red Hat Certified.',
}

function Divider() {
  return (
    <div className="editorial">
      <hr className="ed-divider" />
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Divider />
      <AboutCards />
      <Divider />
      <Services />
      <Divider />
      <ProjectsGrid />
      <Divider />
      <Experience />
      <Divider />
      <CertificationsTeaser />
      <Divider />
      <LatestBlog />
      <div className="pb-24" />
    </>
  )
}
