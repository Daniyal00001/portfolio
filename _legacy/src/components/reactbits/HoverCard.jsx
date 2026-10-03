import React, { useState } from 'react'

const HoverCard = ({ 
  children, 
  className = '',
  overlay = false,
  overlayContent = null,
  hoverScale = false,
  glow = false
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered 
          ? hoverScale ? 'translateY(-8px) scale(1.02)' : 'translateY(-8px)'
          : 'translateY(0)',
        boxShadow: isHovered && glow 
          ? '0 10px 40px rgba(59, 130, 246, 0.3)' 
          : isHovered ? '0 10px 40px rgba(59, 130, 246, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      {children}
      {overlay && overlayContent && (
        <div
          className="absolute inset-0 bg-black/70 flex items-center justify-center transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? 'auto' : 'none'
          }}
        >
          {overlayContent}
        </div>
      )}
    </div>
  )
}

export default HoverCard

