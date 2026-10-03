import React from 'react'

const Stack = ({ items = [], className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            transform: `translate(${index * 4}px, ${index * 4}px)`,
            zIndex: items.length - index
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

export default Stack

