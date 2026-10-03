import React, { useEffect, useState } from 'react'

const GhostCursor = ({ className = '' }) => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
        setIsHovering(true)
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
    }
  }, [])

  return (
    <div
      className={`fixed pointer-events-none z-50 mix-blend-difference ${className}`}
      style={{
        left: cursorPos.x - 10,
        top: cursorPos.y - 10,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: 'white',
        transform: `scale(${isHovering ? 1.5 : 1})`,
        transition: 'transform 0.2s ease-out',
        opacity: isHovering ? 0.8 : 0.3
      }}
    />
  )
}

export default GhostCursor

