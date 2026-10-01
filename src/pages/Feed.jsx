import React, { useMemo, useState } from 'react'
import { Check, MapPin, Megaphone, MessageCircle, Users } from 'lucide-react'
import { useApp } from '../lib/AppContext.jsx'
import { DAYS, DAY_LABELS, ME, studentById } from '../data/students.js'
import { TODAY, CURRENT_HOUR } from '../data/hangouts.js'
import { NOTICES } from '../data/notices.js'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Avatar from '../components/Avatar.jsx'

const TOGGLES = [
  { value: 'all', label: 'All' },
  { value: 'hangouts', label: 'Hangouts' },
  { value: 'notices', label: 'Notices' },
]

function isHappeningNow(h) {
  return h.day === TODAY && CURRENT_HOUR >= h.startHour && CURRENT_HOUR < h.endHour
}

function sortKey(day, hour) {
  return DAYS.indexOf(day) * 100 + hour
}

export default function Feed() {
  const { hangouts, joinHangout, leaveHangout, isLiveFree, liveFreeStartedAt } = useApp()
  const [filter, setFilter] = useState('all')

  const items = useMemo(() => {
    const hangoutItems = hangouts.map((h) => ({ type: 'hangout', key: sortKey(h.day, h.startHour), data: h }))
    const noticeItems = NOTICES.map((n) => ({ type: 'notice', key: sortKey(n.day, n.hour), data: n }))
    const combined = [...hangoutItems, ...noticeItems].sort((a, b) => a.key - b.key)
    const filtered =
      filter === 'hangouts'
        ? combined.filter((i) => i.type === 'hangout')
        : filter === 'notices'
          ? combined.filter((i) => i.type === 'notice')
          : combined
    if (isLiveFree && filter !== 'notices') {
      filtered.unshift({ type: 'live', key: -Infinity, data: { startedAt: liveFreeStartedAt } })
    }
    return filtered
  }, [hangouts, filter, isLiveFree, liveFreeStartedAt])

  return (
    <div>
      <PageHeader
        title="Feed"
        subtitle="Hangouts and campus notices, in one scroll — soonest first."
      />

      <div className="mb-6 flex gap-1.5 rounded-md border border-surface-border bg-white p-1.5 w-fit shadow-card">
        {TOGGLES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setFilter(t.value)}
            className={[
              'rounded px-3.5 py-1.5 text-xs font-semibold transition-colors',
              filter === t.value ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-surface-muted',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Megaphone} title="Nothing here" hint="Try a different filter." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            if (item.type === 'live') return <LiveFreeRow key="live-free" />
            return item.type === 'hangout' ? (
              <HangoutRow
                key={item.data.id}
                hangout={item.data}
                live={isHappeningNow(item.data)}
                onJoin={() => joinHangout(item.data.id)}
                onLeave={() => leaveHangout(item.data.id)}
              />
            ) : (
              <NoticeRow key={item.data.id} notice={item.data} />
            )
          })}
        </div>
      )}
    </div>
  )
}

function HangoutRow({ hangout, live, onJoin, onLeave }) {
  const attendees = hangout.attendeeIds.map(studentById).filter(Boolean)
  const spotsLeft = hangout.maxPeople - attendees.length
  const joined = hangout.attendeeIds.includes('me')
  const full = spotsLeft <= 0 && !joined

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-md border border-surface-border bg-white px-5 py-4 shadow-card">
      <div className="min-w-[220px] flex-1">
        <div className="flex items-center gap-2">
          {live && (
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
            </span>
          )}
          <h3 className="font-display text-base font-semibold text-navy-950">{hangout.title}</h3>
          {live && (
            <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-700">
              Live now
            </span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy-600">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-teal-600" /> {hangout.place}
          </span>
          <span>
            {DAY_LABELS[hangout.day]} · {hangout.startHour}:00–{hangout.endHour}:00
          </span>
        </div>
      </div>

      <div className="flex items-center -space-x-2">
        {attendees.slice(0, 5).map((s) => (
          <Avatar key={s.id} name={s.name} initials={s.initials} color={s.color} size="sm" ring />
        ))}
        {attendees.length === 0 && <Users className="h-5 w-5 text-navy-300" />}
      </div>

      <p className="w-24 shrink-0 text-right text-xs font-medium text-navy-500">
        {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left` : 'Full'}
      </p>

      <button
        type="button"
        onClick={joined ? onLeave : onJoin}
        disabled={full}
        className={[
          'shrink-0 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
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

function LiveFreeRow() {
  const [said, setSaid] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-md border border-teal-300 bg-teal-50 px-5 py-4">
      <div className="min-w-[220px] flex-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
          </span>
          <h3 className="font-display text-base font-semibold text-navy-950">
            {ME.name.split(' ')[0]} just went free — right now
          </h3>
        </div>
        <p className="mt-1 text-xs text-navy-600">{ME.course} · Year {ME.year}</p>
      </div>

      <button
        type="button"
        onClick={() => setSaid(true)}
        disabled={said}
        className={[
          'inline-flex shrink-0 items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed',
          said ? 'border border-teal-600 text-teal-700' : 'bg-navy-900 text-white hover:bg-navy-700',
        ].join(' ')}
      >
        {said ? <Check className="h-3.5 w-3.5" /> : <MessageCircle className="h-3.5 w-3.5" />}
        {said ? 'Said hi' : 'Say hi'}
      </button>
    </div>
  )
}

function NoticeRow({ notice }) {
  return (
    <div className="rounded-md border border-surface-border bg-surface-muted px-5 py-4">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-navy-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy-600">
          Notice
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-navy-400">{notice.category}</span>
        <span className="ml-auto text-xs text-navy-400">
          {DAY_LABELS[notice.day]} · {notice.hour}:00
        </span>
      </div>
      <h3 className="mt-1.5 font-display text-base font-semibold text-navy-950">{notice.title}</h3>
      <p className="mt-1 text-sm text-navy-600">{notice.body}</p>
    </div>
  )
}
