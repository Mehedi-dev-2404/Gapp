import React, { useMemo, useState } from 'react'
import { CalendarX2, Users2 } from 'lucide-react'
import { useApp } from '../lib/AppContext.jsx'
import { DAYS, DAY_LABELS, HOURS, OTHER_STUDENTS } from '../data/students.js'
import { freeBlocks } from '../lib/overlap.js'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Avatar from '../components/Avatar.jsx'
import LiveFreeHero from '../components/LiveFreeHero.jsx'

const DAY_FILTERS = ['All', ...DAYS]
const MIN_LENGTHS = [
  { value: 1, label: '1h+' },
  { value: 2, label: '2h+' },
  { value: 3, label: '3h+' },
]

function peopleFreeDuring(block, students) {
  return students
    .map((student) => {
      const slots = student.timetable[block.day]
      const shared = block.slots.filter((i) => slots[i] === 'free')
      if (shared.length === 0) return null
      return {
        student,
        startHour: HOURS[Math.min(...shared)],
        endHour: HOURS[Math.max(...shared)] + 1,
      }
    })
    .filter(Boolean)
}

export default function WhosFree() {
  const { myTimetable, friendIds, openCreateHangout } = useApp()
  const [dayFilter, setDayFilter] = useState('All')
  const [minLength, setMinLength] = useState(1)
  const [scope, setScope] = useState('friends') // 'friends' | 'everyone'

  const population = useMemo(
    () => (scope === 'friends' ? OTHER_STUDENTS.filter((s) => friendIds.includes(s.id)) : OTHER_STUDENTS),
    [scope, friendIds],
  )

  const myBlocks = useMemo(() => freeBlocks(myTimetable), [myTimetable])

  const visibleBlocks = useMemo(() => {
    return myBlocks
      .filter((b) => (dayFilter === 'All' ? true : b.day === dayFilter))
      .filter((b) => b.lengthHours >= minLength)
  }, [myBlocks, dayFilter, minLength])

  function planFromBlock(block, people) {
    openCreateHangout({
      day: block.day,
      startHour: block.startHour,
      endHour: Math.min(block.startHour + 2, block.endHour),
      invitedIds: people.filter((p) => friendIds.includes(p.student.id)).map((p) => p.student.id),
    })
  }

  return (
    <div>
      <PageHeader
        title="Who's Free"
        subtitle="Your free time, matched against everyone else's — even across different courses."
      />

      <LiveFreeHero />

      <div className="mb-6 flex flex-wrap items-center gap-5 rounded-md border border-surface-border bg-white px-4 py-3 shadow-card">
        <FilterGroup label="Day">
          {DAY_FILTERS.map((d) => (
            <FilterChip key={d} active={dayFilter === d} onClick={() => setDayFilter(d)}>
              {d === 'All' ? 'All week' : DAY_LABELS[d].slice(0, 3)}
            </FilterChip>
          ))}
        </FilterGroup>

        <FilterGroup label="Min. break">
          {MIN_LENGTHS.map((m) => (
            <FilterChip key={m.value} active={minLength === m.value} onClick={() => setMinLength(m.value)}>
              {m.label}
            </FilterChip>
          ))}
        </FilterGroup>

        <FilterGroup label="Show">
          <FilterChip active={scope === 'friends'} onClick={() => setScope('friends')}>
            Friends only
          </FilterChip>
          <FilterChip active={scope === 'everyone'} onClick={() => setScope('everyone')}>
            Everyone
          </FilterChip>
        </FilterGroup>
      </div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-navy-950">
          <Users2 className="h-4 w-4 text-teal-600" /> Your free blocks
        </h2>

        {visibleBlocks.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title="No free blocks match these filters"
            hint="Try a shorter minimum break, a different day, or mark more free time on My Week."
          />
        ) : (
          <div className="space-y-3">
            {visibleBlocks.map((block) => {
              const people = peopleFreeDuring(block, population)
              return (
                <div
                  key={`${block.day}-${block.startIdx}`}
                  className="rounded-md border border-surface-border bg-white px-5 py-4 shadow-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-navy-950">
                        {DAY_LABELS[block.day]} · {block.startHour}:00–{block.endHour}:00
                      </p>
                      <p className="text-xs text-navy-500">{block.lengthHours}h free</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => planFromBlock(block, people)}
                      className="rounded-md border border-navy-900 px-3 py-1.5 text-xs font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
                    >
                      Plan a hangout
                    </button>
                  </div>

                  {people.length === 0 ? (
                    <p className="mt-3 text-sm text-navy-400">
                      No {scope === 'friends' ? 'friends' : 'students'} free then yet.
                    </p>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {people.map(({ student, startHour, endHour }) => (
                        <div
                          key={student.id}
                          className="flex items-center gap-2 rounded-full border border-surface-border bg-surface-muted py-1 pl-1 pr-3"
                          title={`Free ${startHour}:00–${endHour}:00`}
                        >
                          <Avatar name={student.name} initials={student.initials} color={student.color} size="sm" />
                          <span className="text-xs font-medium text-navy-800">
                            {student.name.split(' ')[0]} · {student.course}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

function FilterGroup({ label, children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-navy-400">{label}</span>
      <div className="flex gap-1.5">{children}</div>
    </div>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-navy-900 bg-navy-900 text-white'
          : 'border-surface-border bg-white text-navy-600 hover:border-navy-300',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
