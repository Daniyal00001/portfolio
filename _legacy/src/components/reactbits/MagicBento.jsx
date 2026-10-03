import React from 'react'

const MagicBento = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
          style={{
            gridColumn: index === 0 ? 'span 2' : 'span 1',
            gridRow: index === 0 ? 'span 2' : 'span 1'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export default MagicBento

