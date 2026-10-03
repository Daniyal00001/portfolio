import React from 'react'

const CircularGallery = ({ items = [], className = '' }) => {
  const radius = 150
  const centerX = 200
  const centerY = 200

  return (
    <div className={`relative ${className}`} style={{ width: '400px', height: '400px' }}>
      <svg className="absolute inset-0 w-full h-full">
        {items.map((item, index) => {
          const angle = (index * 2 * Math.PI) / items.length
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="30"
                fill="rgba(59, 130, 246, 0.2)"
                className="hover:fill-blue-500/50 transition-colors"
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-sm"
              >
                {item}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default CircularGallery

