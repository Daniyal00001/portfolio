import React from 'react'
import TiltedCard from './TiltedCard'
import SpotlightCard from './SpotlightCard'

const ProfileCard = ({ name, role, image, className = '' }) => {
  return (
    <TiltedCard className={className}>
      <SpotlightCard className="bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="flex flex-col items-center space-y-4">
          {image && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/50">
              <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">{name}</h3>
            <p className="text-slate-400">{role}</p>
          </div>
        </div>
      </SpotlightCard>
    </TiltedCard>
  )
}

export default ProfileCard

