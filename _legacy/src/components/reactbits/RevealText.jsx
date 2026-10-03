import React, { useEffect, useRef, useState } from 'react'

const RevealText = ({ 
  children, 
  className = '', 
  direction = 'up',
  delay = 0,
  duration = 0.6 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay])

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return isVisible ? 'translateY(0)' : 'translateY(30px)'
      case 'down':
        return isVisible ? 'translateY(0)' : 'translateY(-30px)'
      case 'left':
        return isVisible ? 'translateX(0)' : 'translateX(-30px)'
      case 'right':
        return isVisible ? 'translateX(0)' : 'translateX(30px)'
      default:
        return isVisible ? 'translateY(0)' : 'translateY(30px)'
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`
      }}
    >
      {children}
    </div>
  )
}

export default RevealText

