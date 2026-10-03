import React, { useState } from 'react'
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'
import RevealText from './reactbits/RevealText'
import HoverCard from './reactbits/HoverCard'
import Timeline from './reactbits/Timeline'
import AnimatedTabs from './reactbits/AnimatedTabs'
import AnimatedCard from './reactbits/AnimatedCard'
import SplitText from './reactbits/SplitText'
import { Mydata } from '../utils/MyCv'

const Experience = () => {
  const [activeTab, setActiveTab] = useState(0)

  const experiences = Mydata.Experience.filter(exp => 
    exp.Company !== "PeekGamer" && exp.Company !== "StitchSmart"
  ).map(exp => ({
    title: exp.Position,
    company: exp.Company,
    location: exp.Location,
    period: `${new Date(exp.Duration[0].StartDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${exp.Duration[0].EndDate === 'present' ? 'Present' : new Date(exp.Duration[0].EndDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
    description: exp.Description,
    achievements: exp.Description ? [exp.Description] : []
  }))

  const education = [
    {
      degree: Mydata.Education,
      institution: Mydata.University,
      location: "Punjab, Pakistan",
      period: "Oct 2020 - Sep 2024",
      description: "Specialized in Information Technology with focus on web development and modern technologies"
    }
  ]

  return (
    <section id="experience" className="section-spacing relative" style={{ paddingTop: '150px' }}>
      <div className="container-max section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <RevealText direction="up" delay={0} className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <SplitText text="Experience & Education" className="gradient-text" delay={0.2} />
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              My professional journey and academic background
            </p>
          </RevealText>

          {/* Tab Navigation */}
          <RevealText delay={0.3} className="mb-12">
            <AnimatedTabs
              tabs={['Experience', 'Education']}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </RevealText>

          {/* Content */}
          {activeTab === 0 ? (
            <RevealText key="experience" delay={0.4} direction="up">
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <HoverCard
                    key={index}
                    className="glass-effect rounded-2xl p-8"
                    hoverScale={true}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                        <div className="flex items-center text-blue-400 font-semibold mb-2">
                          <FaBriefcase className="w-4 h-4 mr-2" />
                          {exp.company}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-4">
                          <div className="flex items-center">
                            <FaCalendarAlt className="w-4 h-4 mr-1" />
                            {exp.period}
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                            {exp.location}
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">{exp.description}</p>
                      </div>
                    </div>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-white mb-3">Key Achievements:</h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-start">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              <span className="text-gray-300">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </HoverCard>
                ))}
              </div>
            </RevealText>
          ) : (
            <RevealText key="education" delay={0.4} direction="up">
              <div className="space-y-8">
                {education.map((edu, index) => (
                  <HoverCard
                    key={index}
                    className="glass-effect rounded-2xl p-8"
                    hoverScale={true}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
                        <div className="text-blue-400 font-semibold mb-2">{edu.institution}</div>
                        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-4">
                          <div className="flex items-center">
                            <FaCalendarAlt className="w-4 h-4 mr-1" />
                            {edu.period}
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                            {edu.location}
                          </div>
                        </div>
                        <p className="text-gray-300">{edu.description}</p>
                      </div>
                    </div>
                  </HoverCard>
                ))}
              </div>
            </RevealText>
          )}
        </div>
      </div>
    </section>
  )
}

export default Experience
