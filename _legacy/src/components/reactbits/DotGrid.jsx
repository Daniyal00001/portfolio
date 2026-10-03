import React from 'react'

const DotGrid = ({ 
  rows = 20, 
  cols = 20,
  gap = 20,
  dotSize = 2,
  color = 'rgba(255, 255, 255, 0.1)',
  className = '' 
}) => {
  const dots = []

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      dots.push(
        <div
          key={`${i}-${j}`}
          className="absolute rounded-full transition-all duration-300 hover:bg-blue-500/50"
          style={{
            left: `${j * gap}px`,
            top: `${i * gap}px`,
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            backgroundColor: color
          }}
        />
      )
    }
  }

  return (
    <div className={`relative ${className}`} style={{ width: `${cols * gap}px`, height: `${rows * gap}px` }}>
      {dots}
    </div>
  )
}

export default DotGrid

