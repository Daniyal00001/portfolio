import React, { useState } from 'react'
import { FaCode, FaServer, FaDatabase, FaCloud, FaMobile, FaPalette } from 'react-icons/fa'
import RevealText from './reactbits/RevealText'
import AnimatedCard from './reactbits/AnimatedCard'
import ProgressBar from './reactbits/ProgressBar'
import SplitText from './reactbits/SplitText'
import { Mydata } from '../utils/MyCv'

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('languages')

  // Extract skills from Summary in MyCv.js - based on what's mentioned in the summary
  const skillCategories = {
    languages: {
      title: 'Languages',
      icon: FaCode,
      color: 'from-blue-500 to-cyan-500',
      skills: [
        { name: 'TypeScript', level: 90 },
        { name: 'JavaScript', level: 90 },
        { name: 'HTML', level: 95 },
        { name: 'CSS', level: 95 }
      ]
    },
    frameworks: {
      title: 'Frameworks & Libraries',
      icon: FaServer,
      color: 'from-purple-500 to-pink-500',
      skills: [
        { name: 'ReactJS', level: 95 },
        { name: 'Next.js', level: 85 },
        { name: 'Node.js', level: 75 },
        { name: 'Express', level: 70 }
      ]
    },
    uiFrameworks: {
      title: 'UI Frameworks',
      icon: FaPalette,
      color: 'from-pink-500 to-rose-500',
      skills: [
        { name: 'Ant Design', level: 85 },
        { name: 'Tailwind CSS', level: 90 },
        { name: 'Material UI', level: 85 },
        { name: 'Chakra UI', level: 85 }
      ]
    },
    tools: {
      title: 'Tools & Platforms',
      icon: FaCloud,
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'WordPress', level: 85 },
        { name: 'Firebase', level: 85 },
        { name: 'Vercel', level: 90 },
        { name: 'Git', level: 90 },
        { name: 'GitHub', level: 90 },
        { name: 'Figma', level: 90 }
      ]
    },
    other: {
      title: 'Other Skills',
      icon: FaDatabase,
      color: 'from-indigo-500 to-purple-500',
      skills: [
        { name: 'SEO', level: 85 },
        { name: 'ACF', level: 85 },
        { name: 'CLI', level: 80 },
        { name: 'Ubuntu Linux', level: 80 },
        { name: 'State Management', level: 85 }
      ]
    }
  }

  return (
    <section id="skills" className="py-12 sm:py-16 md:py-20 relative" style={{ paddingTop: '120px' }}>
      <div className="container-max section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <RevealText direction="up" delay={0} className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              <SplitText text="Technical Skills" className="gradient-text" delay={0.2} />
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-3xl mx-auto">
              Skills and technologies I work with
            </p>
          </RevealText>

          {/* Category Tabs */}
          <RevealText delay={0.3} className="flex justify-center mb-6 sm:mb-8">
            <div className="glass-card rounded-2xl p-1.5 sm:p-2 w-full max-w-4xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2">
                {Object.entries(skillCategories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`flex flex-col items-center p-2 sm:p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                      activeCategory === key
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <category.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-1.5" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-center leading-tight">{category.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </RevealText>

          {/* Skills Content */}
          <RevealText key={activeCategory} delay={0.4} direction="up">
            <AnimatedCard className="glass-card rounded-2xl p-4 sm:p-6 md:p-8" hoverScale={false}>
              <div className="flex items-center mb-4 sm:mb-6">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r ${skillCategories[activeCategory].color} flex items-center justify-center mr-3 sm:mr-4`}>
                  {React.createElement(skillCategories[activeCategory].icon, { className: "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" })}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{skillCategories[activeCategory].title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm">Based on experience and expertise</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {skillCategories[activeCategory].skills.map((skill, index) => (
                  <RevealText
                    key={index}
                    delay={0.5 + index * 0.05}
                    direction="left"
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium text-sm sm:text-base">{skill.name}</span>
                      <span className="text-blue-400 font-bold text-sm sm:text-base">{skill.level}%</span>
                    </div>
                    <ProgressBar
                      value={skill.level}
                      delay={0.6 + index * 0.05}
                      showLabel={false}
                      color={skillCategories[activeCategory].color}
                    />
                  </RevealText>
                ))}
              </div>
            </AnimatedCard>
          </RevealText>

          {/* Additional Info */}
          <RevealText delay={0.7} className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16">
            <AnimatedCard className="glass-card rounded-2xl p-4 sm:p-6 text-center" hoverScale={true}>
              <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">34+</div>
              <div className="text-slate-300 text-sm sm:text-base">GitHub Repositories</div>
            </AnimatedCard>
            <AnimatedCard className="glass-card rounded-2xl p-4 sm:p-6 text-center" hoverScale={true}>
              <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">1+</div>
              <div className="text-slate-300 text-sm sm:text-base">Years Experience</div>
            </AnimatedCard>
            <AnimatedCard className="glass-card rounded-2xl p-4 sm:p-6 text-center" hoverScale={true}>
              <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1 sm:mb-2">100%</div>
              <div className="text-slate-300 text-sm sm:text-base">Client Satisfaction</div>
            </AnimatedCard>
          </RevealText>
        </div>
      </div>
    </section>
  )
}

export default Skills
