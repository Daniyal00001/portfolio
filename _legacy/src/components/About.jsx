import React from 'react'
import { FaCode, FaRocket, FaLightbulb, FaHeart, FaGraduationCap, FaMapMarkerAlt, FaDownload } from 'react-icons/fa'
import RevealText from './reactbits/RevealText'
import AnimatedCard from './reactbits/AnimatedCard'
import ProgressBar from './reactbits/ProgressBar'
import SplitText from './reactbits/SplitText'
import AnimatedButton from './reactbits/AnimatedButton'
import { Mydata } from '../utils/MyCv'

const About = () => {
  const stats = [
    { number: "1+", label: "Years Experience", icon: FaCode },
    { number: "34+", label: "GitHub Repositories", icon: FaRocket },
    { number: "100%", label: "Client Satisfaction", icon: FaHeart },
    { number: "24/7", label: "Learning Mode", icon: FaLightbulb }
  ]

  const skills = [
    { name: "ReactJS Development", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "Next.js", level: 85 },
    { name: "WordPress Development", level: 85 },
    { name: "UI/UX Design", level: 90 },
    { name: "Firebase Integration", level: 85 }
  ]

  return (
    <section id="about" className="section-spacing relative" style={{ paddingTop: '150px' }}>
      <div className="container-max section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <RevealText direction="up" delay={0} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <SplitText text="About Me" className="gradient-text" delay={0.2} />
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A passionate developer with a love for creating exceptional digital experiences
            </p>
          </RevealText>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Story */}
            <RevealText direction="right" delay={0.2} className="space-y-6">
              {/* Profile Image */}
              <div className="flex justify-center lg:justify-start mb-6">
                <AnimatedCard hoverScale={true} glow={true}>
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden profile-frame">
                      <img 
                        src="/images/faheem506pk.jpeg" 
                        alt="Muhammad Faheem Iqbal"
                        className="w-full h-full object-cover profile-image"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
              
              <AnimatedCard className="code-card rounded-2xl card-spacing" hoverScale={true} glow={true}>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                  <FaGraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-3" />
                  My Journey
                </h3>
                <div className="text-spacing">
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {Mydata.Summary.split('. ').slice(0, 2).join('. ')}.
                  </p>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {Mydata.Summary.split('. ').slice(2, 4).join('. ')}.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center text-gray-400">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                    <span>{Mydata.Address.split(',')[1]}, {Mydata.Address.split(',')[2]}</span>
                  </div>
                  <a
                    href="/cv/Muhammad_Faheem_Iqbal_CV.pdf"
                    download="Muhammad_Faheem_Iqbal_CV.pdf"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <FaDownload className="w-4 h-4" />
                    <span>Download CV</span>
                  </a>
                </div>
              </AnimatedCard>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <RevealText key={index} delay={0.3 + index * 0.1} direction="up">
                    <AnimatedCard className="glass-effect rounded-xl p-6 text-center" hoverScale={true}>
                      <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </AnimatedCard>
                  </RevealText>
                ))}
              </div>
            </RevealText>

            {/* Right Column - Skills */}
            <RevealText direction="left" delay={0.4} className="space-y-8">
              <AnimatedCard className="glass-effect rounded-2xl p-8" hoverScale={true}>
                <h3 className="text-2xl font-bold text-white mb-6">Technical Skills</h3>
                <div className="space-y-6">
                  {skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">{skill.name}</span>
                        <span className="text-blue-400 font-bold">{skill.level}%</span>
                      </div>
                      <ProgressBar 
                        value={skill.level}
                        delay={0.5 + index * 0.1}
                        showLabel={false}
                      />
                    </div>
                  ))}
                </div>
              </AnimatedCard>

              {/* Personal Traits */}
              <AnimatedCard className="glass-effect rounded-2xl p-8" hoverScale={true}>
                <h3 className="text-2xl font-bold text-white mb-6">What Drives Me</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: FaCode, text: "Clean Code" },
                    { icon: FaRocket, text: "Innovation" },
                    { icon: FaLightbulb, text: "Problem Solving" },
                    { icon: FaHeart, text: "User Experience" }
                  ].map((trait, index) => (
                    <RevealText key={index} delay={0.6 + index * 0.1} direction="up">
                      <AnimatedCard className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors" hoverScale={true}>
                        <trait.icon className="w-5 h-5 text-blue-400" />
                        <span className="text-gray-300">{trait.text}</span>
                      </AnimatedCard>
                    </RevealText>
                  ))}
                </div>
              </AnimatedCard>
            </RevealText>
          </div>

          {/* Call to Action */}
          <RevealText delay={0.8} className="text-center mt-16">
            <AnimatedButton 
              variant="primary"
              onClick={() => {
                const element = document.getElementById('contact')
                if (element) {
                  const offset = 80
                  const elementPosition = element.getBoundingClientRect().top
                  const offsetPosition = elementPosition + window.pageYOffset - offset
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
                }
              }}
            >
              Let's Work Together
            </AnimatedButton>
          </RevealText>
        </div>
      </div>
    </section>
  )
}

export default About
