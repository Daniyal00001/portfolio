import React, { useState, useEffect, lazy, Suspense } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// Lazy load components for better performance
const Hero = lazy(() => import('./components/Hero'))
const About = lazy(() => import('./components/About'))
const Experience = lazy(() => import('./components/Experience'))
const Projects = lazy(() => import('./components/Projects'))
const Skills = lazy(() => import('./components/Skills'))
const Contact = lazy(() => import('./components/Contact'))

function App() {
  const [activeSection, setActiveSection] = useState('hero')

  // Scroll spy to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'experience', 'projects', 'skills', 'contact']
      const scrollPosition = window.scrollY + 100 // Offset for navbar

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Simplified background - no heavy particles for better performance */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-50"></div>
      
      <Navigation activeSection={activeSection} />
      
      <main className="relative z-10">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </Suspense>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default App
