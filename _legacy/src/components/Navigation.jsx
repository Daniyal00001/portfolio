import React, { useState, useEffect } from 'react'
import { FaBars, FaTimes, FaHome, FaUser, FaBriefcase, FaCode, FaCogs, FaEnvelope, FaDownload } from 'react-icons/fa'
import RevealText from './reactbits/RevealText'
import AnimatedCard from './reactbits/AnimatedCard'
import { Mydata } from '../utils/MyCv'

const Navigation = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'hero', label: 'Home', icon: FaHome },
    { id: 'about', label: 'About', icon: FaUser },
    { id: 'experience', label: 'Experience', icon: FaBriefcase },
    { id: 'projects', label: 'Projects', icon: FaCode },
    { id: 'skills', label: 'Skills', icon: FaCogs },
    { id: 'contact', label: 'Contact', icon: FaEnvelope },
  ]

  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Navbar height offset
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'glass-navbar border-b border-slate-800/50 shadow-2xl' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-max">
        <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 md:px-8">
          {/* Logo */}
          <RevealText delay={0} direction="down">
            <div
              onClick={() => handleNavClick('hero')}
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <FaCode className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg md:text-xl font-bold gradient-text leading-tight">
                  {Mydata.Name.split(' ')[0]}
                </span>
                <span className="text-xs sm:text-sm text-slate-400 leading-tight">
                  Frontend Dev
                </span>
              </div>
            </div>
          </RevealText>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
                  activeSection === item.id
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {activeSection === item.id && (
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-sm"></span>
                )}
                <span className="relative flex items-center space-x-2">
                  <item.icon className={`w-4 h-4 transition-transform ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </span>
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></span>
                )}
              </button>
            ))}
            <a
              href="/cv/Muhammad_Faheem_Iqbal_CV.pdf"
              download="Muhammad_Faheem_Iqbal_Resume.pdf"
              className="ml-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center space-x-2"
            >
              <FaDownload className="w-3 h-3" />
              <span>CV</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 glass-card rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="glass-card border-t border-slate-800/50 mx-4 mb-4 rounded-b-2xl">
            <div className="p-4 space-y-2">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-blue-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                  {activeSection === item.id && (
                    <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </button>
              ))}
              <a
                href="/cv/Muhammad_Faheem_Iqbal_CV.pdf"
                download="Muhammad_Faheem_Iqbal_Resume.pdf"
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium mt-2"
              >
                <FaDownload className="w-4 h-4" />
                <span>Download CV</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
