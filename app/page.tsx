"use client"
import gsap from 'gsap'
import { ReactLenis, LenisRef } from 'lenis/react'
import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'

export default function Home() {
  const lenisRef = useRef<LenisRef>(null)
  
  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
  
    gsap.ticker.add(update)
  
    return () => gsap.ticker.remove(update)
  }, [])
  
  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <Navbar />
      
    </ReactLenis>
  )
}