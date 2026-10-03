import React from 'react'

const LogoLoop = ({ logos = [], className = '' }) => {
  return (
    <div className={`flex items-center space-x-4 overflow-hidden ${className}`}>
      {[...logos, ...logos].map((Logo, index) => (
        <div
          key={index}
          className="flex-shrink-0 animate-scroll"
          style={{
            animation: `scroll ${logos.length * 2}s linear infinite`,
            animationDelay: `${index * 0.5}s`
          }}
        >
          <Logo className="w-12 h-12 text-slate-400 hover:text-white transition-colors" />
        </div>
      ))}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

export default LogoLoop

