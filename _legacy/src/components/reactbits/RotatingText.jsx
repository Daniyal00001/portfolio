import React, { useState, useEffect } from 'react'

const RotatingText = ({ 
  texts = [], 
  interval = 2000,
  className = '' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (texts.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % texts.length)
    }, interval)

    return () => clearInterval(timer)
  }, [texts, interval])

  if (texts.length === 0) return null

  return (
    <span className={`inline-block ${className}`}>
      {texts[currentIndex]}
    </span>
  )
}

export default RotatingText

