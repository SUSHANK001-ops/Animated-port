import React from 'react'
import Navbar from '../ui/Navbar'
import Footer from '../ui/Footer'
import TerminalModal from '../ui/TerminalModal'
import PageTransition from '../ui/PageTransition'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <TerminalModal />
    </>
  )
}
