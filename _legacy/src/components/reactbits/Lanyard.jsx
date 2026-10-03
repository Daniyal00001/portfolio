import React from 'react'

const Lanyard = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-t-full"></div>
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
        {children}
      </div>
    </div>
  )
}

export default Lanyard

