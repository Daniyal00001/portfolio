import React, { useEffect, useState } from 'react'

const ScrollVelocity = ({ children, className = '' }) => {
  const [velocity, setVelocity] = useState(0)
  const lastScrollY = React.useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const diff = Math.abs(currentScrollY - lastScrollY.current)
      setVelocity(diff)
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={className}
      style={{
        transform: `scale(${1 + velocity * 0.0001})`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  )
}

export default ScrollVelocity

