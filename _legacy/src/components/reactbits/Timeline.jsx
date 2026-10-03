import React from 'react'

const Timeline = ({ items = [], className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />
      
      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={index} className="relative flex items-start">
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0 w-16 h-16 flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full ring-4 ring-slate-900" />
            </div>
            
            {/* Content */}
            <div className="ml-6 flex-1 pb-8">
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeline

