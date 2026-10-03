import React from 'react'
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaChevronDown, FaCode, FaBriefcase, FaGraduationCap, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaRocket, FaStar, FaUsers } from 'react-icons/fa'
import SplitText from './reactbits/SplitText'
import Typewriter from './reactbits/Typewriter'
import RevealText from './reactbits/RevealText'
import AnimatedButton from './reactbits/AnimatedButton'
import AnimatedCard from './reactbits/AnimatedCard'
import { Mydata } from '../utils/MyCv'

const Hero = () => {
  const texts = [
    "ReactJS Developer",
    "Frontend Specialist", 
    "UI/UX Enthusiast",
    "WordPress Developer",
    "IoT Enthusiast"
  ]

  const stats = [
    { icon: FaBriefcase, value: "1+", label: "Years Experience", color: "from-blue-500 to-cyan-500" },
    { icon: FaRocket, value: "34+", label: "Projects", color: "from-purple-500 to-pink-500" },
    { icon: FaStar, value: "100%", label: "Client Satisfaction", color: "from-yellow-500 to-orange-500" },
    { icon: FaUsers, value: "5+", label: "Happy Clients", color: "from-green-500 to-emerald-500" }
  ]

  const quickInfo = [
    { icon: FaMapMarkerAlt, text: Mydata.Address },
    { icon: FaPhone, text: Mydata.Phone.split(',')[0] },
    { icon: FaEnvelope, text: Mydata.Email }
  ]

  const scrollToSection = (sectionId) => {
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
  }

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 sm:py-24 md:py-28 lg:py-32">
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-20 right-4 md:right-8 text-purple-400 font-mono text-xs opacity-20 animate-pulse">
          <div>const dev = "Faheem"</div>
        </div>
        <div className="absolute top-1/2 left-1/4 text-pink-400 font-mono text-xs opacity-15">
          <div>function create()</div>
        </div>
      </div>

      <div className="container-max section-padding relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 items-start lg:items-center">
            {/* Left Column - Profile & Info */}
            <RevealText direction="right" delay={0.2} className="lg:col-span-1">
              <div className="text-center lg:text-left space-y-6">
                {/* Profile Image */}
                <div className="flex justify-center lg:justify-start">
                  <div className="relative">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden profile-frame cursor-pointer">
                      <img 
                        src="/images/faheem506pk.jpeg" 
                        alt="Muhammad Faheem Iqbal"
                        className="w-full h-full object-cover profile-image"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full animate-pulse flex items-center justify-center shadow-lg border-2 border-slate-900 z-10">
                      <span className="text-white text-xs md:text-sm font-bold">✓</span>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <AnimatedCard className="glass-card rounded-2xl p-4 sm:p-6" hoverScale={true}>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-center lg:justify-start">
                    <FaGraduationCap className="w-5 h-5 mr-2 text-blue-400" />
                    Quick Info
                  </h3>
                  <div className="space-y-3">
                    {quickInfo.map((info, index) => (
                      <div key={index} className="flex items-center text-slate-300 text-sm md:text-base">
                        <info.icon className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
                        <span className="break-words">{info.text}</span>
                      </div>
                    ))}
                  </div>
                </AnimatedCard>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  {stats.map((stat, index) => (
                    <RevealText key={index} delay={0.4 + index * 0.1} direction="up">
                      <AnimatedCard className="glass-card rounded-xl p-3 sm:p-4 text-center" hoverScale={true}>
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 mx-auto mb-2 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-[10px] sm:text-xs md:text-sm text-slate-400 leading-tight">{stat.label}</div>
                      </AnimatedCard>
                    </RevealText>
                  ))}
                </div>
              </div>
            </RevealText>

            {/* Right Column - Main Content */}
            <RevealText direction="left" delay={0.3} className="lg:col-span-2">
              <div className="space-y-6">
                {/* Name & Role */}
                <div className="text-center lg:text-left">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
                    <SplitText 
                      text="Muhammad Faheem Iqbal" 
                      className="gradient-text"
                      delay={0.5}
                      duration={0.8}
                    />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-blue-400 mb-4 min-h-[2.5rem]">
                    <Typewriter 
                      texts={texts}
                      speed={100}
                      deleteSpeed={50}
                      delay={2000}
                    />
                  </div>
                </div>

                {/* Description Card */}
                <AnimatedCard className="glass-card rounded-2xl p-6 sm:p-8" hoverScale={true}>
                  <RevealText delay={0.7} direction="up">
                    <p className="text-slate-300 leading-relaxed text-base sm:text-lg md:text-xl mb-4">
                      {Mydata.Summary.split('. ').slice(0, 2).join('. ')}.
                    </p>
                    <p className="text-slate-400 leading-relaxed text-sm sm:text-base md:text-lg">
                      {Mydata.Summary.split('. ').slice(2, 4).join('. ')}.
                    </p>
                  </RevealText>
                </AnimatedCard>

                {/* Education & Experience Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <AnimatedCard className="glass-card rounded-xl p-4 sm:p-5 md:p-6" hoverScale={true}>
                    <div className="flex items-center mb-3">
                      <FaGraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mr-2 sm:mr-3 flex-shrink-0" />
                      <h4 className="text-base sm:text-lg font-bold text-white">Education</h4>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">{Mydata.Education}</p>
                    <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm mt-2 leading-relaxed">{Mydata.University}</p>
                  </AnimatedCard>

                  <AnimatedCard className="glass-card rounded-xl p-4 sm:p-5 md:p-6" hoverScale={true}>
                    <div className="flex items-center mb-3">
                      <FaBriefcase className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 mr-2 sm:mr-3 flex-shrink-0" />
                      <h4 className="text-base sm:text-lg font-bold text-white">Current Role</h4>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm md:text-base font-semibold leading-relaxed">{Mydata.Experience[0].Position}</p>
                    <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm mt-2 leading-relaxed">{Mydata.Experience[0].Company}</p>
                  </AnimatedCard>
                </div>
              </div>
            </RevealText>
          </div>

          {/* CTA Buttons & Social Links */}
          <RevealText delay={0.9} direction="up" className="mt-6 sm:mt-8 lg:mt-12">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-6">
              <AnimatedButton
                onClick={() => scrollToSection('projects')}
                variant="primary"
                className="flex items-center justify-center space-x-2 w-full sm:w-auto text-sm sm:text-base"
              >
                <FaCode className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>View Projects</span>
              </AnimatedButton>
              
              <a
                href="/cv/Muhammad_Faheem_Iqbal_CV.pdf"
                download="Muhammad_Faheem_Iqbal_Resume.pdf"
                className="w-full sm:w-auto"
              >
                <AnimatedButton
                  variant="secondary"
                  className="flex items-center justify-center space-x-2 w-full text-sm sm:text-base"
                >
                  <FaDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Download CV</span>
                </AnimatedButton>
              </a>

              {/* Social Links */}
              <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4">
                <AnimatedCard className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 glass-card rounded-lg flex items-center justify-center text-slate-300 hover:text-gray-300 transition-colors cursor-pointer">
                  <a
                    href="https://github.com/faheem506pk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center"
                  >
                    <FaGithub className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </a>
                </AnimatedCard>
                
                <AnimatedCard className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 glass-card rounded-lg flex items-center justify-center text-slate-300 hover:text-blue-400 transition-colors cursor-pointer">
                  <a
                    href="https://www.linkedin.com/in/faheem506pk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center"
                  >
                    <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </a>
                </AnimatedCard>
                
                <AnimatedCard className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 glass-card rounded-lg flex items-center justify-center text-slate-300 hover:text-pink-400 transition-colors cursor-pointer">
                  <a
                    href={`mailto:${Mydata.Email}`}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </a>
                </AnimatedCard>
              </div>
            </div>
          </RevealText>
        </div>
      </div>
    </section>
  )
}

export default Hero
