import React, { useEffect, useRef, useState } from 'react'

const ScrollReveal = ({ 
  children, 
  delay = 0,
  direction = 'up',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
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
    if (!isVisible) {
      switch (direction) {
        case 'up': return 'translateY(50px)'
        case 'down': return 'translateY(-50px)'
        case 'left': return 'translateX(50px)'
        case 'right': return 'translateX(-50px)'
        default: return 'translateY(50px)'
      }
    }
    return 'translate(0)'
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
      }}
    >
      {children}
    </div>
  )
}

export default ScrollReveal

