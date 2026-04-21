import React from 'react'
import clsx from 'clsx'

interface PremiumIconProps {
  children: React.ReactNode
  color: string
}

export const PremiumIcon = ({ children, color }: PremiumIconProps) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-lg shadow-inner',
        'backdrop-blur-md border border-white/10'
      )}
      style={{
        width: '28px',
        height: '28px',
        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
        boxShadow: `inset 0 1px 1px ${color}50, 0 2px 6px ${color}30`,
      }}
    >
      <div style={{ color, filter: `drop-shadow(0 0 2px ${color})` }}>
        {children}
      </div>
    </div>
  )
}
