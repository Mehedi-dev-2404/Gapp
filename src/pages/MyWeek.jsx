import React, { useEffect, useRef, useState } from 'react'
import { CalendarDays, Check, MousePointerClick } from 'lucide-react'
import { useApp } from '../lib/AppContext.jsx'
import { DAYS, DAY_LABELS, HOURS, slotLabel } from '../data/students.js'
import PageHeader from '../components/PageHeader.jsx'

export default function MyWeek() {
  const { myTimetable, toggleSlot, setSlotRange, saveTimetable, timetableSaved } = useApp()
  const [drag, setDrag] = useState(null) // { status }
  const [justSaved, setJustSaved] = useState(false)
  const touchedAny = useRef(false)

  useEffect(() => {
    function onUp() {
      setDrag(null)
    }
    window.addEventListener('mouseup', onUp)
    return () => window.removeEventListener('mouseup', onUp)
  }, [])

  function startDrag(day, idx) {
    const current = myTimetable[day][idx]
    const nextStatus = current === 'free' ? 'class' : 'free'
    setDrag({ status: nextStatus })
    touchedAny.current = true
    setSlotRange(day, [idx], nextStatus)
  }

  function enterCell(day, idx) {
    if (!drag) return
    setSlotRange(day, [idx], drag.status)
  }

  function handleSave() {
    saveTimetable()
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  const hasAnyFree = DAYS.some((d) => myTimetable[d].some((s) => s === 'free'))

  return (
    <div>
      <PageHeader
        title="My Week"
        subtitle="Click, or click and drag, to mark when you're free. This is what friends compare against on Who's Free."
        action={
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700 focus-visible:outline-none"
          >
            {justSaved ? <Check className="h-4 w-4" /> : null}
            {justSaved ? 'Saved' : 'Save timetable'}
          </button>
        }
      />

      <div className="mb-4 flex items-center gap-4 text-xs text-navy-500">
        <span className="inline-flex items-center gap-1.5">
          <MousePointerClick className="h-3.5 w-3.5" /> Click a slot to toggle. Drag across several to paint them at once.
        </span>
        <span
          className={[
            'ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium',
            timetableSaved ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700',
          ].join(' ')}
        >
          {timetableSaved ? 'All changes saved' : 'Unsaved changes'}
        </span>
      </div>

      {!hasAnyFree && (
        <div className="mb-5 rounded-md border border-dashed border-surface-border bg-white px-5 py-4 text-sm text-navy-600">
          <CalendarDays className="mr-2 inline h-4 w-4 text-teal-600" />
          Your week looks fully booked. Mark a few hours as free so friends can find you on Who's Free.
        </div>
      )}

      <div
        className="overflow-hidden rounded-md border border-surface-border bg-white shadow-card select-none"
        style={{ userSelect: drag ? 'none' : undefined }}
      >
        <div className="grid grid-cols-[80px_repeat(5,1fr)]">
          <div className="border-b border-r border-surface-border bg-surface-muted" />
          {DAYS.map((day) => (
            <div
              key={day}
              className="border-b border-r border-surface-border bg-surface-muted px-3 py-3 text-center text-sm font-semibold text-navy-800 last:border-r-0"
            >
              {DAY_LABELS[day]}
            </div>
          ))}

          {HOURS.map((hour, rowIdx) => (
            <React.Fragment key={hour}>
              <div className="flex items-start justify-end border-b border-r border-surface-border px-3 py-2 text-xs text-navy-500">
                {slotLabel(hour)}
              </div>
              {DAYS.map((day) => {
                const status = myTimetable[day][rowIdx]
                const isFree = status === 'free'
                return (
                  <button
                    type="button"
                    key={day + hour}
                    onMouseDown={() => startDrag(day, rowIdx)}
                    onMouseEnter={() => enterCell(day, rowIdx)}
                    aria-pressed={isFree}
                    aria-label={`${DAY_LABELS[day]} ${slotLabel(hour)}: ${isFree ? 'free' : 'in class'}`}
                    className={[
                      'h-11 border-b border-r border-surface-border text-xs font-medium transition-colors last:border-r-0 focus-visible:relative focus-visible:z-10',
                      isFree
                        ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                        : 'bg-navy-50 text-navy-400 hover:bg-navy-100',
                    ].join(' ')}
                  >
                    {isFree ? 'Free' : 'In class'}
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
