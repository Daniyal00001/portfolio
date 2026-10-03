import React, { useState } from 'react'
import { FaGithub, FaExternalLinkAlt, FaCode, FaEye } from 'react-icons/fa'
import RevealText from './reactbits/RevealText'
import AnimatedCard from './reactbits/AnimatedCard'
import HoverCard from './reactbits/HoverCard'
import AnimatedButton from './reactbits/AnimatedButton'
import SplitText from './reactbits/SplitText'
import { Mydata } from '../utils/MyCv'

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [hoveredProject, setHoveredProject] = useState(null)

  const projects = [
    {
      id: 1,
      title: "PeekGamer",
      description: "A modern game discovery platform built with Next.js 14 and TypeScript. Features custom dark-themed UI, SEO optimization, advanced search/filtering, and server-side rendering.",
      image: "/api/placeholder/600/400",
      category: "frontend",
      technologies: ["Next.js 14", "TypeScript", "Ant Design", "Vercel"],
      github: "https://github.com/faheem506pk/peekgamer",
      live: "https://peekgamer.vercel.app",
      featured: true
    },
    {
      id: 2,
      title: "StitchSmart",
      description: "A comprehensive tailor shop management system with role-based access, offline-first functionality using IndexedDB, and analytics dashboard.",
      image: "/api/placeholder/600/400",
      category: "fullstack",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Firebase", "Zustand", "IndexedDB"],
      github: "https://github.com/faheem506pk/stitchsmart",
      live: "https://stitchsmart.vercel.app",
      featured: true
    },
    {
      id: 3,
      title: "Qotion",
      description: "A Notion-style table clone with drag-and-drop functionality, real-time sync via Firebase, and customizable data types.",
      image: "/api/placeholder/600/400",
      category: "frontend",
      technologies: ["React", "TypeScript", "Jotai", "Zustand", "Firebase", "Tailwind CSS"],
      github: "https://github.com/faheem506pk/notion_table_clone",
      live: "https://qotion.vercel.app",
      featured: true
    },
    {
      id: 4,
      title: "KaTable App",
      description: "A dynamic and customizable table application featuring editable columns, column renaming, and persistent data storage using localStorage.",
      image: "/api/placeholder/600/400",
      category: "frontend",
      technologies: ["React", "TypeScript", "Material UI", "KaTable"],
      github: "https://github.com/faheem506pk/my-katable-app",
      live: "https://iotion.vercel.app",
      featured: false
    },
    {
      id: 5,
      title: "PlantPulse",
      description: "An IoT-based greenhouse monitoring system with ESP32, React dashboard, and Firebase integration for real-time plant health monitoring.",
      image: "/api/placeholder/600/400",
      category: "fullstack",
      technologies: ["ESP32", "React", "Firebase", "C++", "Arduino IDE"],
      github: "https://github.com/faheem506pk/PlantPulse",
      live: "https://plantpulse.vercel.app",
      featured: true
    },
    {
      id: 6,
      title: "Cinematic Vistas",
      description: "A modern movie browsing platform with responsive design, search functionality, and dynamic content integration.",
      image: "/api/placeholder/600/400",
      category: "frontend",
      technologies: ["React", "TypeScript", "Tailwind CSS", "API Integration"],
      github: "https://github.com/faheem506pk/cinematic-vistas",
      live: "https://cinematic-vistas.vercel.app",
      featured: false
    },
    {
      id: 7,
      title: "ExplorePak",
      description: "A tourism platform with admin panel for package and booking management, built with PHP and MySQL.",
      image: "/api/placeholder/600/400",
      category: "fullstack",
      technologies: ["PHP", "MySQL", "HTML5", "CSS3", "Bootstrap"],
      github: "https://github.com/faheem506pk/ExplorePak",
      live: "https://explorepak.vercel.app",
      featured: false
    },
    {
      id: 8,
      title: "Speedy Eats",
      description: "A fully dynamic WordPress website with custom theme, ACF integration, and SEO optimization for food delivery services.",
      image: "/api/placeholder/600/400",
      category: "fullstack",
      technologies: ["WordPress", "ACF", "PHP", "CSS", "JavaScript"],
      github: "https://github.com/faheem506pk/speedy-eats",
      live: "https://speedy-eats.vercel.app",
      featured: true
    }
  ]

  const filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'fullstack', label: 'Full Stack' }
  ]

  const filteredProjects = projects.filter(project => 
    activeFilter === 'all' || project.category === activeFilter
  )

  return (
    <section id="projects" className="min-h-screen py-20 relative" style={{ paddingTop: '150px' }}>
      <div className="container-max section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <RevealText direction="up" delay={0} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <SplitText text="Featured Projects" className="gradient-text" delay={0.2} />
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A showcase of my recent work and side projects
            </p>
          </RevealText>

          {/* Filter Buttons */}
          <RevealText delay={0.3} className="flex justify-center mb-12">
            <div className="glass-effect rounded-full p-2">
              <div className="flex flex-wrap justify-center gap-2">
                {filters.map((filter) => (
                  <AnimatedButton
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    variant={activeFilter === filter.key ? 'primary' : 'ghost'}
                    className="px-6 py-3 rounded-full"
                  >
                    {filter.label}
                  </AnimatedButton>
                ))}
              </div>
            </div>
          </RevealText>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <RevealText 
                key={project.id} 
                delay={0.4 + index * 0.1} 
                direction="up"
              >
                <HoverCard
                  className={`glass-effect rounded-2xl overflow-hidden group cursor-pointer ${
                    project.featured ? 'ring-2 ring-blue-500/50' : ''
                  }`}
                  overlay={true}
                  overlayContent={
                    <div className="flex space-x-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                      >
                        <FaGithub className="w-5 h-5" />
                      </a>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                      >
                        <FaExternalLinkAlt className="w-5 h-5" />
                      </a>
                    </div>
                  }
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                      <FaCode className="w-16 h-16 text-white/50" />
                    </div>
                    {project.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
                      >
                        <FaGithub className="w-4 h-4" />
                        <span>Code</span>
                      </a>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <FaEye className="w-4 h-4" />
                        <span>Live</span>
                      </a>
                    </div>
                  </div>
                </HoverCard>
              </RevealText>
            ))}
          </div>

          {/* Call to Action */}
          <RevealText delay={0.8} className="text-center mt-16">
            <a
              href="https://github.com/faheem506pk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AnimatedButton variant="primary">
                View All Projects on GitHub
              </AnimatedButton>
            </a>
          </RevealText>
        </div>
      </div>
    </section>
  )
}

export default Projects
