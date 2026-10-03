import React from 'react'

const AnimatedTabs = ({ 
  tabs = [], 
  activeTab, 
  onTabChange,
  className = '' 
}) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="glass-effect rounded-full p-2">
        <div className="flex space-x-2">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => onTabChange(index)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === index
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnimatedTabs

