import React, { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../lib/AppContext.jsx'
import { DAYS, DAY_LABELS, HOURS, OTHER_STUDENTS } from '../data/students.js'
import { PLACES } from '../data/hangouts.js'
import Avatar from './Avatar.jsx'

function freeHoursForDay(timetable, day) {
  return HOURS.map((hour, idx) => ({ hour, idx, free: timetable[day][idx] === 'free' })).filter((h) => h.free)
}

function maxContiguousLength(timetable, day, startIdx) {
  const slots = timetable[day]
  let len = 0
  for (let i = startIdx; i < slots.length; i++) {
    if (slots[i] !== 'free') break
    len += 1
  }
  return Math.max(1, len)
}

export default function CreateHangoutModal({ prefill, onClose }) {
  const { myTimetable, friendIds, createHangout } = useApp()

  const daysWithFreeTime = useMemo(
    () => DAYS.filter((d) => freeHoursForDay(myTimetable, d).length > 0),
    [myTimetable],
  )

  const initialDay = prefill?.day && daysWithFreeTime.includes(prefill.day) ? prefill.day : daysWithFreeTime[0] || DAYS[0]

  const CUSTOM_PLACE = '__custom__'

  const prefillKnownPlace = prefill?.place && PLACES.includes(prefill.place) ? prefill.place : null
  const prefillCustomPlace = prefill?.place && !prefillKnownPlace ? prefill.place : ''

  const [title, setTitle] = useState('')
  const [place, setPlace] = useState(prefillKnownPlace || (prefillCustomPlace ? CUSTOM_PLACE : PLACES[0]))
  const [customPlace, setCustomPlace] = useState(prefillCustomPlace)
  const [day, setDay] = useState(initialDay)
  const [startHour, setStartHour] = useState(prefill?.startHour ?? freeHoursForDay(myTimetable, initialDay)[0]?.hour ?? HOURS[0])
  const [duration, setDuration] = useState(
    prefill?.startHour && prefill?.endHour ? Math.max(1, prefill.endHour - prefill.startHour) : 1,
  )
  const [maxPeople, setMaxPeople] = useState(4)
  const [visibility, setVisibility] = useState('public')
  const [invitedIds, setInvitedIds] = useState(prefill?.invitedIds || [])

  const freeHours = useMemo(() => freeHoursForDay(myTimetable, day), [myTimetable, day])
  const startIdx = HOURS.indexOf(startHour)
  const maxDuration = startIdx >= 0 ? maxContiguousLength(myTimetable, day, startIdx) : 1

  const friends = OTHER_STUDENTS.filter((s) => friendIds.includes(s.id))

  function handleDayChange(nextDay) {
    setDay(nextDay)
    const first = freeHoursForDay(myTimetable, nextDay)[0]
    setStartHour(first ? first.hour : HOURS[0])
    setDuration(1)
  }

  function toggleInvite(id) {
    setInvitedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    const finalPlace = place === CUSTOM_PLACE ? customPlace.trim() : place
    if (!finalPlace) return
    createHangout({
      title: title.trim(),
      place: finalPlace,
      day,
      startHour,
      endHour: startHour + duration,
      maxPeople: Number(maxPeople),
      visibility,
      invitedIds: visibility === 'friends' ? invitedIds : [],
    })
    onClose()
  }

  const noFreeTime = daysWithFreeTime.length === 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 px-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-md bg-white shadow-xl scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-navy-950">Create hangout</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-navy-400 hover:bg-surface-muted hover:text-navy-700"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {noFreeTime ? (
          <div className="px-6 py-8 text-sm text-navy-600">
            You don't have any free time marked on My Week yet. Add some free slots first so you can pick a time.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
            <Field label="Title">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Coffee before seminar"
                className="w-full rounded-md border border-surface-border px-3 py-2 text-sm text-navy-900 focus-visible:border-teal-500"
              />
            </Field>

            <Field label="Place">
              <select
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="w-full rounded-md border border-surface-border px-3 py-2 text-sm text-navy-900 focus-visible:border-teal-500"
              >
                {PLACES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
                <option value={CUSTOM_PLACE}>Somewhere else…</option>
              </select>
              {place === CUSTOM_PLACE && (
                <input
                  type="text"
                  required
                  autoFocus
                  value={customPlace}
                  onChange={(e) => setCustomPlace(e.target.value)}
                  placeholder="e.g. Trafalgar Tavern"
                  className="mt-2 w-full rounded-md border border-surface-border px-3 py-2 text-sm text-navy-900 focus-visible:border-teal-500"
                />
              )}
            </Field>

            <div className="grid grid-cols-3 gap-3">
              <Field label="Day">
                <select
                  value={day}
                  onChange={(e) => handleDayChange(e.target.value)}
                  className="w-full rounded-md border border-surface-border px-3 py-2 text-sm text-navy-900 focus-visible:border-teal-500"
                >
                  {daysWithFreeTime.map((d) => (
                    <option key={d} value={d}>
                      {DAY_LABELS[d]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Start">
                <select
                  value={startHour}
                  onChange={(e) => {
                    setStartHour(Number(e.target.value))
                    setDuration(1)
                  }}
                  className="w-full rounded-md border border-surface-border px-3 py-2 text-sm text-navy-900 focus-visible:border-teal-500"
                >
                  {freeHours.map((h) => (
                    <option key={h.hour} value={h.hour}>
                      {h.hour}:00
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Duration">
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full rounded-md border border-surface-border px-3 py-2 text-sm text-navy-900 focus-visible:border-teal-500"
                >
                  {Array.from({ length: maxDuration }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}h
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Max people">
              <input
                type="number"
                min={2}
                max={20}
                value={maxPeople}
                onChange={(e) => setMaxPeople(e.target.value)}
                className="w-28 rounded-md border border-surface-border px-3 py-2 text-sm text-navy-900 focus-visible:border-teal-500"
              />
            </Field>

            <Field label="Visibility">
              <div className="flex gap-2">
                <VisibilityOption
                  active={visibility === 'public'}
                  onClick={() => setVisibility('public')}
                  title="Public"
                  hint="Anyone can see and join from the feed"
                />
                <VisibilityOption
                  active={visibility === 'friends'}
                  onClick={() => setVisibility('friends')}
                  title="Invite friends"
                  hint="Only people you tick below can see it"
                />
              </div>
            </Field>

            {visibility === 'friends' && (
              <Field label="Invite friends">
                {friends.length === 0 ? (
                  <p className="text-sm text-navy-400">
                    You haven't added any friends yet — add some on the Friends page.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {friends.map((f) => {
                      const checked = invitedIds.includes(f.id)
                      return (
                        <label
                          key={f.id}
                          className={[
                            'flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 text-xs',
                            checked ? 'border-teal-500 bg-teal-50' : 'border-surface-border hover:border-navy-300',
                          ].join(' ')}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleInvite(f.id)}
                            className="accent-teal-600"
                          />
                          <Avatar name={f.name} initials={f.initials} color={f.color} size="sm" />
                          <span className="font-medium text-navy-800">{f.name.split(' ')[0]}</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </Field>
            )}

            <div className="flex justify-end gap-2 border-t border-surface-border pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-4 py-2 text-sm font-semibold text-navy-600 hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-teal-400"
              >
                Create hangout
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-400">{label}</label>
      {children}
    </div>
  )
}

function VisibilityOption({ active, onClick, title, hint }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex-1 rounded-md border px-3 py-2.5 text-left transition-colors',
        active ? 'border-navy-900 bg-navy-900 text-white' : 'border-surface-border text-navy-700 hover:border-navy-300',
      ].join(' ')}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className={['mt-0.5 text-[11px]', active ? 'text-navy-200' : 'text-navy-400'].join(' ')}>{hint}</p>
    </button>
  )
}
