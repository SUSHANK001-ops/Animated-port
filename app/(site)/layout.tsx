import React from 'react'
import Navbar from '../ui/Navbar'
import Footer from '../ui/Footer'
import TerminalModal from '../ui/TerminalModal'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <TerminalModal />
    </>
  )
}
