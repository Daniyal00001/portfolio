import React, { useState } from 'react'

const AnimatedInput = ({ 
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  label = '',
  required = false,
  name = ''
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  React.useEffect(() => {
    setHasValue(value && value.length > 0)
  }, [value])

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e)
          setHasValue(e.target.value.length > 0)
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 transition-all duration-300 ${
          isFocused 
            ? 'border-blue-500 ring-2 ring-blue-500/20 outline-none' 
            : 'border-slate-700/50'
        } ${hasValue ? 'border-blue-500/50' : ''}`}
      />
    </div>
  )
}

export default AnimatedInput

