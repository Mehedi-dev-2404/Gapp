import React, { useMemo, useState } from 'react'
import { Search, UserCheck, UserPlus, Users2 } from 'lucide-react'
import { useApp } from '../lib/AppContext.jsx'
import { OTHER_STUDENTS } from '../data/students.js'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Avatar from '../components/Avatar.jsx'

export default function Friends() {
  const { friendIds, addFriend, removeFriend } = useApp()
  const [query, setQuery] = useState('')
  const [onlyFriends, setOnlyFriends] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return OTHER_STUDENTS.filter((s) => {
      if (onlyFriends && !friendIds.includes(s.id)) return false
      if (!q) return true
      return (
        s.name.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q) ||
        String(s.year).includes(q)
      )
    })
  }, [query, onlyFriends, friendIds])

  return (
    <div>
      <PageHeader
        title="Friends"
        subtitle="Everyone at Greenwich is visible on Who's Free — add friends to spotlight them first."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-md border border-surface-border bg-white px-4 py-3 shadow-card">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, course or year"
            className="w-full rounded-md border border-surface-border py-2 pl-9 pr-3 text-sm text-navy-900 focus-visible:border-teal-500"
          />
        </div>
        <button
          type="button"
          onClick={() => setOnlyFriends((v) => !v)}
          className={[
            'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors',
            onlyFriends
              ? 'border-navy-900 bg-navy-900 text-white'
              : 'border-surface-border text-navy-600 hover:border-navy-300',
          ].join(' ')}
        >
          <Users2 className="h-3.5 w-3.5" />
          {onlyFriends ? 'Showing friends' : 'Showing everyone'}
        </button>
      </div>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-400">
        People at Greenwich ({results.length})
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No one matches"
          hint="Try a different name, course, or clear your search."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((s) => {
            const isFriend = friendIds.includes(s.id)
            return (
              <div
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-md border border-surface-border bg-white px-4 py-3.5 shadow-card"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={s.name} initials={s.initials} color={s.color} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy-900">{s.name}</p>
                    <p className="truncate text-xs text-navy-500">{s.course}</p>
                    <span className="mt-1 inline-block rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-navy-500">
                      Year {s.year}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => (isFriend ? removeFriend(s.id) : addFriend(s.id))}
                  className={[
                    'inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors',
                    isFriend
                      ? 'border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-100'
                      : 'border-surface-border text-navy-600 hover:border-navy-300',
                  ].join(' ')}
                >
                  {isFriend ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                  {isFriend ? 'Friends' : 'Add'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
