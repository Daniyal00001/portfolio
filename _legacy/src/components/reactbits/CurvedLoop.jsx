import React from 'react'

const CurvedLoop = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
        <path
          d="M 0,100 Q 50,0 100,100 T 200,100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-blue-400"
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default CurvedLoop

