"use client"
import { ReactLenis, LenisRef } from 'lenis/react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
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
import { SectionProvider } from './components/SectionContext'

export default function Home() {
  const lenisRef = useRef<LenisRef>(null)
  const [loading, setLoading] = useState(true)
  const mainRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [loading])

  const handleLoadingComplete = () => {
    setLoading(false)
    // Animate main content in
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' }
      )
    }
  }

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
        <SectionProvider>
        <div ref={mainRef} className='min-h-screen overflow-x-hidden' style={{ opacity: loading ? 0 : 1 }}>
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />
      
      <Navbar />
      <Homepage />
      <TextScroll />
      <AboutPage />
      <Marquee />
      
      
      
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
      </div>        </SectionProvider>    </ReactLenis>
    </>
  )
}