import React from 'react'

const GradientText = ({ 
  children, 
  gradient = 'from-blue-400 via-purple-400 to-pink-400',
  className = '' 
}) => {
  return (
    <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  )
}

export default GradientText

