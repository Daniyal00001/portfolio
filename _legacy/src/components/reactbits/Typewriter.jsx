import React, { useState, useEffect } from 'react'

const Typewriter = ({ 
  texts = [], 
  speed = 100, 
  deleteSpeed = 50, 
  delay = 2000,
  className = '' 
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(speed)

  useEffect(() => {
    const handleTyping = () => {
      const fullText = texts[currentTextIndex]
      
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1))
        setTypingSpeed(deleteSpeed)
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1))
        setTypingSpeed(speed)
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), delay)
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false)
        setCurrentTextIndex((prev) => (prev + 1) % texts.length)
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [currentText, isDeleting, currentTextIndex, texts, speed, deleteSpeed, delay, typingSpeed])

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export default Typewriter

