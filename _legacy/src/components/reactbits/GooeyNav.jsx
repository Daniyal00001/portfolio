import React, { useState } from 'react'

const GooeyNav = ({ items = [], activeIndex = 0, onItemClick, className = '' }) => {
  return (
    <nav className={`relative ${className}`}>
      <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-xl rounded-full px-4 py-2 border border-white/10">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => onItemClick && onItemClick(index)}
            className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? 'text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item}
            {activeIndex === index && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default GooeyNav

