import React, { useState } from 'react'

const Folder = ({ title, children, defaultOpen = false, className = '' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-medium">{title}</span>
        <span className={`text-white transition-transform ${isOpen ? 'rotate-90' : ''}`}>
          ▶
        </span>
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-white/10">
          {children}
        </div>
      )}
    </div>
  )
}

export default Folder

