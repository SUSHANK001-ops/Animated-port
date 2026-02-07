"use client"
import { ReactLenis, LenisRef } from 'lenis/react'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Homepage from './components/Homepage'
import AboutPage from './components/AboutPage'
import TextScroll from './components/UI/TextScroll'
import Marquee from './components/UI/Marquee'
import ServicesPage from './components/ServicesPage'
import ProjectsPage from './components/ProjectsPage'
import ExperiencePage from './components/ExperiencePage'
import ContactPage from './components/ContactPage'
import Footer from './components/Footer'

export default function Home() {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <div className='min-h-screen overflow-x-hidden'>
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />
      
      <Navbar />
      <Homepage />
      <TextScroll />
      <AboutPage />
      <Marquee />
      
      {/* Divider */}
      <div className="section-divider" />
      
      <ServicesPage />
      
      {/* Divider */}
      <div className="section-divider" />
      
      <ProjectsPage />
      
      {/* Divider */}
      <div className="section-divider" />
      
      <ExperiencePage />
      
      {/* Divider */}
      <div className="section-divider" />
      
      <ContactPage />
      <Footer />
      </div>
    </ReactLenis>
  )
}