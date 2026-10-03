import React, { useState } from 'react'

const AnimatedCard = ({ 
  children, 
  className = '',
  hoverScale = true,
  glow = false,
  delay = 0 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`transition-all duration-300 ${className}`}
      style={{
        transform: isHovered && hoverScale ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered && glow 
          ? '0 10px 40px rgba(34, 197, 94, 0.3)' 
          : '0 4px 20px rgba(0, 0, 0, 0.1)',
        transitionDelay: `${delay}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}

export default AnimatedCard

