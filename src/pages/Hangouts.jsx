import React, { useMemo, useState } from 'react'
import { Coffee, MapPin, Plus, Users } from 'lucide-react'
import { useApp } from '../lib/AppContext.jsx'
import { DAY_LABELS, studentById } from '../data/students.js'
import { TODAY, CURRENT_HOUR } from '../data/hangouts.js'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Avatar from '../components/Avatar.jsx'

const FILTERS = [
  { value: 'now', label: 'Happening now' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
]

function isHappeningNow(h) {
  return h.day === TODAY && CURRENT_HOUR >= h.startHour && CURRENT_HOUR < h.endHour
}

export default function Hangouts() {
  const { hangouts, joinHangout, leaveHangout, openCreateHangout } = useApp()
  const [filter, setFilter] = useState('week')

  const visible = useMemo(() => {
    const sorted = [...hangouts].sort((a, b) => a.startHour - b.startHour)
    if (filter === 'now') return sorted.filter(isHappeningNow)
    if (filter === 'today') return sorted.filter((h) => h.day === TODAY)
    return sorted
  }, [hangouts, filter])

  return (
    <div>
      <PageHeader
        title="Hangouts"
        subtitle="Public breaks happening around campus — join one, or start your own."
        action={
          <button
            type="button"
            onClick={() => openCreateHangout()}
            className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            <Plus className="h-4 w-4" /> Create hangout
          </button>
        }
      />

      <div className="mb-6 flex gap-1.5 rounded-md border border-surface-border bg-white p-1.5 w-fit shadow-card">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={[
              'rounded px-3.5 py-1.5 text-xs font-semibold transition-colors',
              filter === f.value ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-surface-muted',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Coffee}
          title="No hangouts here yet"
          hint="Nothing matches this filter right now. Try another filter, or create the first hangout."
          action={
            <button
              type="button"
              onClick={() => openCreateHangout()}
              className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-teal-400"
            >
              Create hangout
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((h) => (
            <HangoutCard
              key={h.id}
              hangout={h}
              live={isHappeningNow(h)}
              onJoin={() => joinHangout(h.id)}
              onLeave={() => leaveHangout(h.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function HangoutCard({ hangout, live, onJoin, onLeave }) {
  const attendees = hangout.attendeeIds.map(studentById).filter(Boolean)
  const spotsLeft = hangout.maxPeople - attendees.length
  const joined = hangout.attendeeIds.includes('me')
  const host = studentById(hangout.hostId)
  const full = spotsLeft <= 0 && !joined

  return (
    <div className="flex flex-col rounded-md border border-surface-border bg-white p-5 shadow-card">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-semibold leading-snug text-navy-950">{hangout.title}</h3>
        {live && (
          <span className="shrink-0 rounded-full bg-teal-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy-950">
            Live now
          </span>
        )}
      </div>

      <div className="space-y-1 text-xs text-navy-600">
        <p className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-teal-600" /> {hangout.place}
        </p>
        <p>
          {DAY_LABELS[hangout.day]} · {hangout.startHour}:00–{hangout.endHour}:00
        </p>
        <p className="text-navy-400">Hosted by {host ? host.name.split(' ')[0] : 'Unknown'}</p>
        {hangout.visibility === 'friends' && (
          <p className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy-500">
            Invite only
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center -space-x-2">
          {attendees.slice(0, 5).map((s) => (
            <Avatar key={s.id} name={s.name} initials={s.initials} color={s.color} size="sm" ring />
          ))}
          {attendees.length === 0 && <Users className="h-5 w-5 text-navy-300" />}
        </div>
        <p className="text-xs font-medium text-navy-500">
          {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left` : 'Full'}
        </p>
      </div>

      <button
        type="button"
        onClick={joined ? onLeave : onJoin}
        disabled={full}
        className={[
          'mt-4 w-full rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
          joined
            ? 'border border-navy-900 text-navy-900 hover:bg-navy-50'
            : 'bg-teal-500 text-navy-950 hover:bg-teal-400',
        ].join(' ')}
      >
        {joined ? 'Leave' : full ? 'Full' : 'Join'}
      </button>
    </div>
  )
}
