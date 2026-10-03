import React, { useState } from 'react'

const Dock = ({ items = [], className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div className={`flex items-end justify-center space-x-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-3 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="transition-all duration-300 cursor-pointer"
          style={{
            transform: hoveredIndex === index ? 'scale(1.5) translateY(-10px)' : 'scale(1)',
            zIndex: hoveredIndex === index ? 10 : 1
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

export default Dock

