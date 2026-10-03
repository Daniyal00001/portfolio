import React, { useEffect, useRef, useState } from 'react'

const ProgressBar = ({ 
  value, 
  max = 100,
  className = '',
  showLabel = true,
  color = 'from-blue-500 via-purple-500 to-pink-500',
  delay = 0 
}) => {
  const [progress, setProgress] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setProgress(value)
          }, delay * 1000)
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
  }, [value, delay])

  return (
    <div ref={ref} className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 font-medium">Progress</span>
          <span className="text-blue-400 font-bold">{progress}%</span>
        </div>
      )}
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar

