import React from 'react'

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-7 flex items-start justify-between gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-950">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-navy-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
