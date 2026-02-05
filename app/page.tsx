"use client"
import { ReactLenis, LenisRef } from 'lenis/react'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Homepage from './components/Homepage'

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
      <Homepage />
    </ReactLenis>
  )
}