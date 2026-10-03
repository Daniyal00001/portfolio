import React from 'react'
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart, FaCode, FaArrowUp, FaDownload } from 'react-icons/fa'
import RevealText from './reactbits/RevealText'
import AnimatedCard from './reactbits/AnimatedCard'
import { Mydata } from '../utils/MyCv'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'Home', section: 'hero' },
    { label: 'About', section: 'about' },
    { label: 'Experience', section: 'experience' },
    { label: 'Projects', section: 'projects' },
    { label: 'Skills', section: 'skills' },
    { label: 'Contact', section: 'contact' }
  ]

  const socialLinks = [
    { icon: FaGithub, url: 'https://github.com/faheem506pk', label: 'GitHub', gradient: 'from-gray-700 to-gray-900' },
    { icon: FaLinkedin, url: 'https://www.linkedin.com/in/faheem506pk/', label: 'LinkedIn', gradient: 'from-blue-600 to-blue-800' },
    { icon: FaEnvelope, url: `mailto:${Mydata.Email}`, label: 'Email', gradient: 'from-pink-500 to-rose-600' }
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-slate-800/50 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-950 backdrop-blur-xl">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      <div className="container-max section-padding py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 mb-8 md:mb-10 lg:mb-12">
          {/* Brand Section */}
          <RevealText direction="up" delay={0} className="lg:col-span-5">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-50"></div>
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FaCode className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold gradient-text">
                    {Mydata.Name}
                  </h3>
                  <p className="text-sm text-slate-400">Frontend Developer</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base max-w-md">
                {Mydata.Summary.split('. ').slice(0, 2).join('. ')}.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center space-x-3 pt-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target={social.url.startsWith('mailto:') ? '_self' : '_blank'}
                    rel={social.url.startsWith('mailto:') ? '' : 'noopener noreferrer'}
                    className="group relative"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${social.gradient} rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity`}></div>
                    <div className={`relative w-11 h-11 bg-gradient-to-r ${social.gradient} rounded-lg flex items-center justify-center text-white transform group-hover:scale-110 transition-transform`}>
                      <social.icon className="w-5 h-5" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </RevealText>

          {/* Quick Links */}
          <RevealText direction="up" delay={0.1} className="lg:col-span-3">
            <div>
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={`#${link.section}`}
                      className="text-slate-400 hover:text-white transition-all duration-300 text-sm flex items-center group py-1"
                    >
                      <span className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300 rounded-full"></span>
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </RevealText>

          {/* Contact Info */}
          <RevealText direction="up" delay={0.2} className="lg:col-span-4">
            <div>
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></span>
                Get In Touch
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start group">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-3 group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                    <FaMapMarkerAlt className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Location</p>
                    <p className="text-slate-300 text-sm break-words">{Mydata.Address}</p>
                  </div>
                </li>
                <li className="flex items-center group">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mr-3 group-hover:bg-purple-500/20 transition-colors flex-shrink-0">
                    <FaPhone className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Phone</p>
                    <a href={`tel:${Mydata.Phone.split(',')[0].replace(/\s/g, '')}`} className="text-slate-300 hover:text-white text-sm transition-colors break-all">
                      {Mydata.Phone.split(',')[0]}
                    </a>
                  </div>
                </li>
                <li className="flex items-center group">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mr-3 group-hover:bg-pink-500/20 transition-colors flex-shrink-0">
                    <FaEnvelope className="w-4 h-4 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <a href={`mailto:${Mydata.Email}`} className="text-slate-300 hover:text-white text-sm transition-colors break-all">
                      {Mydata.Email}
                    </a>
                  </div>
                </li>
              </ul>
              
              {/* Download CV Button */}
              <a
                href="/cv/Muhammad_Faheem_Iqbal_CV.pdf"
                download="Muhammad_Faheem_Iqbal_Resume.pdf"
                className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              >
                <FaDownload className="w-4 h-4" />
                <span>Download CV</span>
              </a>
            </div>
          </RevealText>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50 pt-6 md:pt-8 lg:pt-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <p className="text-slate-500 text-xs sm:text-sm">
                © {currentYear} <span className="text-white font-semibold">{Mydata.Name}</span>. All rights reserved.
              </p>
              <span className="hidden sm:inline text-slate-600">•</span>
              <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-2">
                Made with <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 animate-pulse" /> using React & Tailwind CSS
              </p>
            </div>
            
           
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

