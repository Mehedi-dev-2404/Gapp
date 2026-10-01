import React from 'react'
import { Radio, X, Users } from 'lucide-react'
import { useApp } from '../lib/AppContext.jsx'
import { HOURS, studentById, LIVE_NOW_DEMO_IDS } from '../data/students.js'
import { TODAY, CURRENT_HOUR } from '../data/hangouts.js'
import Avatar from './Avatar.jsx'

export default function LiveFreeHero() {
  const { myTimetable, isLiveFree, toggleLiveFree, cancelLiveFree, openCreateHangout } = useApp()

  const slotIdx = HOURS.indexOf(CURRENT_HOUR)
  const isBusyNow = slotIdx >= 0 && myTimetable[TODAY][slotIdx] === 'class'
  const liveFriends = LIVE_NOW_DEMO_IDS.map(studentById).filter(Boolean)

  function planWithLiveFriends() {
    openCreateHangout({
      day: TODAY,
      startHour: CURRENT_HOUR,
      endHour: Math.min(CURRENT_HOUR + 1, 18),
      invitedIds: liveFriends.map((f) => f.id),
    })
  }

  return (
    <div className="mb-6 rounded-md border border-surface-border bg-white px-5 py-4 shadow-card">
      {!isLiveFree ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-navy-950">Right now</p>
              <p className="text-xs text-navy-500">Let friends know you're free this minute — not just this week.</p>
            </div>
            <button
              type="button"
              onClick={toggleLiveFree}
              className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-teal-400"
            >
              <Radio className="h-4 w-4" />
              I'm free right now
            </button>
          </div>
          {isBusyNow && (
            <p className="mt-3 text-xs text-amber-700">
              You're in class right now — go free anyway?
            </p>
          )}
        </>
      ) : (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2.5 rounded-md bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-400" />
              </span>
              You're live — friends can see you
            </div>
            <button
              type="button"
              onClick={cancelLiveFree}
              className="inline-flex items-center gap-1 text-xs font-semibold text-navy-500 hover:text-navy-800"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          </div>

          {liveFriends.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-md border border-surface-border bg-surface-muted px-4 py-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400">
                <Users className="h-3.5 w-3.5" /> Also free now
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-3">
                {liveFriends.map((f) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <Avatar name={f.name} initials={f.initials} color={f.color} size="sm" ring ringClassName="ring-emerald-400" />
                    <span className="text-xs font-medium text-navy-800">
                      {f.name.split(' ')[0]} · {f.course}
                    </span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={planWithLiveFriends}
                className="shrink-0 rounded-md border border-navy-900 px-3 py-1.5 text-xs font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
              >
                Plan something
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
