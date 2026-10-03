import React from 'react'

const ChromaGrid = ({ rows = 10, cols = 10, className = '' }) => {
  const cells = []

  for (let i = 0; i < rows * cols; i++) {
    const hue = (i * 137.508) % 360
    cells.push(
      <div
        key={i}
        className="aspect-square border border-white/10 hover:border-white/30 transition-colors"
        style={{
          background: `hsl(${hue}, 70%, 50%, 0.1)`
        }}
      />
    )
  }

  return (
    <div
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`
      }}
    >
      {cells}
    </div>
  )
}

export default ChromaGrid

