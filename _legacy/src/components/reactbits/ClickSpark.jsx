import React, { useState, useEffect, useRef } from 'react'

const ClickSpark = ({ children, className = '' }) => {
  const [sparks, setSparks] = useState([])
  const containerRef = useRef(null)

  const createSpark = (e) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newSpark = {
      id: Date.now(),
      x,
      y,
      angle: Math.random() * Math.PI * 2,
      distance: 50 + Math.random() * 50
    }

    setSparks(prev => [...prev, newSpark])

    setTimeout(() => {
      setSparks(prev => prev.filter(spark => spark.id !== newSpark.id))
    }, 500)
  }

  return (
    <div
      ref={containerRef}
      onClick={createSpark}
      className={`relative ${className}`}
    >
      {children}
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="absolute pointer-events-none"
          style={{
            left: spark.x,
            top: spark.y,
            transform: `translate(${Math.cos(spark.angle) * spark.distance}px, ${Math.sin(spark.angle) * spark.distance}px)`,
            opacity: 0,
            animation: 'sparkFade 0.5s ease-out forwards'
          }}
        >
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
        </div>
      ))}
      <style>{`
        @keyframes sparkFade {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(${sparks[0]?.distance || 50}px, ${sparks[0]?.distance || 50}px) scale(0);
          }
        }
      `}</style>
    </div>
  )
}

export default ClickSpark

