import React, { useState } from 'react'

export const Card = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
)

const CardSwap = ({ cards = [], className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className={`relative ${className}`}>
      {cards.map((card, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {card}
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex ? 'bg-blue-500 w-8' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default CardSwap

