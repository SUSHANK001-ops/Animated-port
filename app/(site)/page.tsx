import React from 'react'
import type { Metadata } from 'next'
import Hero from './_sections/Hero'
import AboutBento from './_sections/AboutBento'
import TechStack from './_sections/TechStack'
import ProjectsGrid from './_sections/ProjectsGrid'
import Services from './_sections/Services'
import LatestBlog from './_sections/LatestBlog'
import VinylQuote from './_sections/VinylQuote'
import WidePhoto from './_sections/WidePhoto'
import Experience from './_sections/Experience'
import CertificationsTeaser from './_sections/CertificationsTeaser'

export const metadata: Metadata = {
  title: 'Sushanka Lamichhane – DevOps Engineer & Full-Stack Developer',
  description:
    'DevOps Engineer and Full-Stack Developer from Nepal. AWS · Docker · Kubernetes · Terraform · CI/CD · Red Hat Certified.',
}

function Divider() {
  return (
    <div className="editorial-page my-14">
      <div className="wavy-divider" />
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Divider />
      <AboutBento />
      <Divider />
      <TechStack />
      <Divider />
      <ProjectsGrid />
      <Divider />
      <Services />
      <Divider />
      <LatestBlog />
      <Divider />
      <VinylQuote />
      <div className="my-10" />
      <WidePhoto />
      <Divider />
      <Experience />
      <Divider />
      <CertificationsTeaser />
      <div className="pb-24" />
    </>
  )
}
