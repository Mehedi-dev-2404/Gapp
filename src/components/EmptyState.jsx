import React from 'react'

export default function EmptyState({ icon: Icon, title, hint, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-surface-border bg-white px-6 py-14 text-center">
      {Icon && (
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-teal-50">
          <Icon className="h-5 w-5 text-teal-600" strokeWidth={2} />
        </div>
      )}
      <p className="font-medium text-navy-900">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-navy-500">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
