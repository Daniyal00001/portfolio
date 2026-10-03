import React, { useState, useEffect } from 'react'

const Shuffle = ({ 
  text = '',
  interval = 50,
  className = '' 
}) => {
  const [displayText, setDisplayText] = useState(text)
  const [isShuffling, setIsShuffling] = useState(false)

  const shuffle = () => {
    setIsShuffling(true)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let iterations = 0
    const maxIterations = 10

    const intervalId = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iterations) {
              return text[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )

      iterations += 1 / 3

      if (iterations >= text.length) {
        clearInterval(intervalId)
        setDisplayText(text)
        setIsShuffling(false)
      }
    }, interval)

    return () => clearInterval(intervalId)
  }

  return (
    <span 
      className={className}
      onMouseEnter={shuffle}
    >
      {displayText}
    </span>
  )
}

export default Shuffle

