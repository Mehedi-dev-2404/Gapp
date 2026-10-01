import React from 'react'

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
}

export default function Avatar({ name, initials, color, size = 'md', ring = false, ringClassName = 'ring-white' }) {
  return (
    <span
      title={name}
      className={[
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
        SIZES[size] || SIZES.md,
        ring ? ['ring-2', ringClassName].join(' ') : '',
      ].join(' ')}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  )
}
