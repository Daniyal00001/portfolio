import React, { useState } from 'react'

const AnimatedButton = ({ 
  children, 
  onClick,
  className = '',
  variant = 'primary',
  disabled = false 
}) => {
  const [isPressed, setIsPressed] = useState(false)

  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-300 transform'
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-blue-500/30',
    secondary: 'border-2 border-blue-500/50 text-blue-400 bg-blue-500/10 backdrop-blur-sm hover:bg-blue-500 hover:text-white',
    ghost: 'border border-slate-700 text-slate-300 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700 hover:text-white'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{
        transform: isPressed ? 'scale(0.95)' : 'scale(1)'
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
    </button>
  )
}

export default AnimatedButton

