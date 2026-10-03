import React, { useState, useEffect, useRef } from 'react'

const CountUp = ({ 
  end, 
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '' 
}) => {
  const [count, setCount] = useState(0)
  const countRef = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && count === 0) {
          const startTime = Date.now()
          const startValue = 0
          const endValue = end

          const updateCount = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
            
            setCount(currentCount)

            if (progress < 1) {
              requestAnimationFrame(updateCount)
            } else {
              setCount(endValue)
            }
          }

          updateCount()
        }
      },
      { threshold: 0.5 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
      observerRef.current = observer
    }

    return () => {
      if (observerRef.current && countRef.current) {
        observerRef.current.unobserve(countRef.current)
      }
    }
  }, [end, duration, count])

  return (
    <span ref={countRef} className={className}>
      {prefix}{count}{suffix}
    </span>
  )
}

export default CountUp

