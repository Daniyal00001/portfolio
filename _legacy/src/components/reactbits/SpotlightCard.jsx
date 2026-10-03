import React, { useState, useRef, useEffect } from 'react'

const SpotlightCard = ({ children, className = '' }) => {
  const cardRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    const card = cardRef.current
    if (card) {
      card.addEventListener('mousemove', handleMouseMove)
      return () => card.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.3), transparent 70%)`,
          opacity: mousePosition.x > 0 ? 1 : 0
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default SpotlightCard

