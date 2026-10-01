import React from 'react'
import { NavLink } from 'react-router-dom'
import { CalendarDays, Users2, Coffee, Newspaper, Contact, MapPin, RotateCcw } from 'lucide-react'
import { useApp } from '../lib/AppContext.jsx'
import { ME } from '../data/students.js'
import Avatar from './Avatar.jsx'

const NAV_ITEMS = [
  { to: '/', label: 'My Week', icon: CalendarDays, end: true },
  { to: '/whos-free', label: "Who's Free", icon: Users2 },
  { to: '/hangouts', label: 'Hangouts', icon: Coffee },
  { to: '/map', label: 'Map', icon: MapPin },
  { to: '/feed', label: 'Feed', icon: Newspaper },
  { to: '/friends', label: 'Friends', icon: Contact },
]

export default function Sidebar() {
  const { resetDemo } = useApp()

  function handleReset() {
    if (window.confirm('Reset all demo data? This clears your timetable, hangouts and friends.')) {
      resetDemo()
    }
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-navy-900 text-white">
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-500">
            <span className="font-display text-sm font-semibold text-navy-950">G</span>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">Gapp</span>
        </div>
        <p className="mt-2 text-xs leading-snug text-navy-200">
          Find who's free, plan a hangout. Built for University of Greenwich students.
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-teal-500 text-navy-950'
                  : 'text-navy-100 hover:bg-navy-700 hover:text-white',
              ].join(' ')
            }
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-navy-700 px-3 py-4">
        <button
          type="button"
          onClick={handleReset}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-navy-200 transition-colors hover:bg-navy-700 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={2} />
          Reset demo
        </button>
        <div className="mt-3 flex items-center gap-2 px-3">
          <Avatar name={ME.name} initials={ME.initials} color={ME.color} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{ME.name}</p>
            <p className="truncate text-xs text-navy-300">{ME.course}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
