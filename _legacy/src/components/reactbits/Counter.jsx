import React from 'react'
import CountUp from './CountUp'

const Counter = ({ end, prefix = '', suffix = '', className = '' }) => {
  return <CountUp end={end} prefix={prefix} suffix={suffix} className={className} />
}

export default Counter

