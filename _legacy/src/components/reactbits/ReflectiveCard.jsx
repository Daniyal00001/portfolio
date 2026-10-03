import React from 'react'
import TiltedCard from './TiltedCard'

const ReflectiveCard = ({ children, className = '' }) => {
  return (
    <TiltedCard className={className} intensity={10}>
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        {children}
      </div>
    </TiltedCard>
  )
}

export default ReflectiveCard

