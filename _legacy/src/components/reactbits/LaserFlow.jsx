import React, { useEffect, useRef } from 'react'

const LaserFlow = ({ className = '' }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 5) * i + Math.sin(time + i) * 50
        const y = canvas.height / 2 + Math.cos(time + i) * 100

        const gradient = ctx.createLinearGradient(x - 50, y, x + 50, y)
        gradient.addColorStop(0, 'transparent')
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.3 + Math.sin(time + i) * 0.2})`)
        gradient.addColorStop(1, 'transparent')

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x - 50, y)
        ctx.lineTo(x + 50, y)
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}

export default LaserFlow

