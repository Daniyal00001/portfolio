import React from 'react'

const GlassSurface = ({ children, className = '', blur = 20 }) => {
  return (
    <div
      className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl ${className}`}
      style={{
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`
      }}
    >
      {children}
    </div>
  )
}

export default GlassSurface

