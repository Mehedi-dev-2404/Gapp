import React, { useMemo, useState } from 'react'
import { X, Users2, Coffee, Plus } from 'lucide-react'
import { useApp } from '../lib/AppContext.jsx'
import { studentById, DAY_LABELS } from '../data/students.js'
import {
  BUILDINGS,
  VIEWBOX,
  CAMPUS_OUTLINE,
  RIVER,
  buildingById,
  freeStudentsByBuilding,
  dotColorClass,
  hangoutsNearBuilding,
} from '../data/campus.js'
import PageHeader from '../components/PageHeader.jsx'
import Avatar from '../components/Avatar.jsx'

function dotTextClass(count) {
  if (count >= 5) return 'fill-white'
  return 'fill-navy-950'
}

export default function CampusMap() {
  const { hangouts, joinHangout, openCreateHangout } = useApp()
  const [selectedId, setSelectedId] = useState(null)

  const freeByBuilding = useMemo(() => freeStudentsByBuilding(), [])
  const selected = selectedId ? buildingById(selectedId) : null
  const freeHere = selectedId ? freeByBuilding[selectedId] || [] : []
  const nearbyHangouts = selected ? hangoutsNearBuilding(hangouts, selected) : []

  function handlePlanHere() {
    if (!selected) return
    openCreateHangout({ place: selected.name })
  }

  return (
    <div>
      <PageHeader
        title="Map"
        subtitle="A stylised layout of campus — click a building to see who's free there right now."
      />

      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-md border border-surface-border bg-white px-4 py-3 text-xs text-navy-600 shadow-card">
        <span className="font-semibold uppercase tracking-wide text-navy-400">Free right now</span>
        <LegendDot colorClass="fill-teal-200" label="1–2 people" />
        <LegendDot colorClass="fill-teal-500" label="3–4 people" />
        <LegendDot colorClass="fill-navy-900" label="5+ people" />
      </div>

      <div className="relative h-[calc(100vh-280px)] min-h-[480px] overflow-hidden rounded-md border border-surface-border bg-white shadow-card">
        <svg
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          className="h-full w-full"
          role="img"
          aria-label="Stylised map of University of Greenwich campus"
        >
          {/* Campus outline */}
          <rect
            x={CAMPUS_OUTLINE.x}
            y={CAMPUS_OUTLINE.y}
            width={CAMPUS_OUTLINE.width}
            height={CAMPUS_OUTLINE.height}
            rx={18}
            fill="#F5F7FA"
            stroke="#00205B"
            strokeWidth={3}
          />
          <text
            x={CAMPUS_OUTLINE.x + CAMPUS_OUTLINE.width / 2}
            y={CAMPUS_OUTLINE.y - 20}
            textAnchor="middle"
            className="fill-navy-900 font-display text-[26px] font-semibold"
          >
            University of Greenwich
          </text>

          {/* Buildings */}
          {BUILDINGS.map((b) => {
            const count = (freeByBuilding[b.id] || []).length
            const colorClass = dotColorClass(count)
            const cx = b.x + b.width - 14
            const cy = b.y + 14
            return (
              <g
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                className="cursor-pointer outline-none"
                tabIndex={0}
                role="button"
                aria-label={`${b.name}, ${count} free right now`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedId(b.id)
                }}
              >
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.width}
                  height={b.height}
                  rx={10}
                  fill={b.onCampus ? '#FFFFFF' : '#F5F7FA'}
                  stroke="#00205B"
                  strokeWidth={2}
                  strokeDasharray={b.onCampus ? undefined : '6 5'}
                  className={[
                    'transition-colors',
                    selectedId === b.id ? 'fill-teal-50' : '',
                  ].join(' ')}
                />
                <text
                  x={b.x + b.width / 2}
                  y={b.y + b.height / 2 - 6}
                  textAnchor="middle"
                  className="fill-navy-900 text-[16px] font-semibold"
                >
                  {b.name}
                </text>
                {!b.onCampus && (
                  <text
                    x={b.x + b.width / 2}
                    y={b.y + b.height / 2 + 16}
                    textAnchor="middle"
                    className="fill-navy-400 text-[11px] font-medium uppercase tracking-wide"
                  >
                    Off campus
                  </text>
                )}
                {count > 0 && (
                  <g>
                    <circle cx={cx} cy={cy} r={14} className={colorClass} stroke="#00205B" strokeWidth={1.5} />
                    <text
                      x={cx}
                      y={cy + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={['text-[13px] font-bold', dotTextClass(count)].join(' ')}
                    >
                      {count}
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* River Thames */}
          <rect x={0} y={RIVER.y} width={VIEWBOX.width} height={RIVER.height} fill="#A6E8E4" />
          <text
            x={VIEWBOX.width / 2}
            y={RIVER.y + RIVER.height / 2 + 4}
            textAnchor="middle"
            className="fill-navy-700 text-[13px] font-semibold uppercase tracking-wide"
          >
            River Thames
          </text>
        </svg>
      </div>

      {/* Backdrop */}
      {selected && (
        <div
          className="fixed inset-0 z-30 bg-navy-950/20"
          onClick={() => setSelectedId(null)}
        />
      )}

      {/* Side panel */}
      <div
        className={[
          'fixed inset-y-0 right-0 z-40 w-full max-w-sm transform bg-white shadow-xl transition-transform duration-300 ease-out',
          selected ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {selected && (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between border-b border-surface-border px-6 py-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-navy-950">{selected.name}</h2>
                <p className="mt-1 text-xs text-navy-500">{selected.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-md p-1.5 text-navy-400 hover:bg-surface-muted hover:text-navy-700"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-6">
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-navy-400">
                  <Users2 className="h-3.5 w-3.5 text-teal-600" /> Free here right now ({freeHere.length})
                </h3>
                {freeHere.length === 0 ? (
                  <p className="text-sm text-navy-400">No one's free here at the moment.</p>
                ) : (
                  <div className="space-y-2">
                    {freeHere.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-2 rounded-full border border-surface-border bg-surface-muted py-1 pl-1 pr-3"
                      >
                        <Avatar name={s.name} initials={s.initials} color={s.color} size="sm" />
                        <span className="text-xs font-medium text-navy-800">
                          {s.name.split(' ')[0]} · {s.course}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-navy-400">
                  <Coffee className="h-3.5 w-3.5 text-teal-600" /> Hangouts here
                </h3>
                {nearbyHangouts.length === 0 ? (
                  <p className="text-sm text-navy-400">No hangouts planned here yet.</p>
                ) : (
                  <div className="space-y-3">
                    {nearbyHangouts.map((h) => {
                      const attendees = h.attendeeIds.map(studentById).filter(Boolean)
                      const joined = h.attendeeIds.includes('me')
                      const full = attendees.length >= h.maxPeople && !joined
                      const host = studentById(h.hostId)
                      return (
                        <div key={h.id} className="rounded-md border border-surface-border px-4 py-3">
                          <p className="text-sm font-semibold text-navy-950">{h.title}</p>
                          <p className="mt-0.5 text-xs text-navy-500">
                            {DAY_LABELS[h.day]} · {h.startHour}:00–{h.endHour}:00
                          </p>
                          <p className="text-xs text-navy-400">
                            Hosted by {host ? host.name.split(' ')[0] : 'Unknown'}
                          </p>
                          <button
                            type="button"
                            onClick={() => joinHangout(h.id)}
                            disabled={joined || full}
                            className={[
                              'mt-3 w-full rounded-md px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                              joined
                                ? 'border border-navy-900 text-navy-900'
                                : 'bg-teal-500 text-navy-950 hover:bg-teal-400',
                            ].join(' ')}
                          >
                            {joined ? 'Joined' : full ? 'Full' : 'Join'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            </div>

            <div className="border-t border-surface-border px-6 py-4">
              <button
                type="button"
                onClick={handlePlanHere}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
              >
                <Plus className="h-4 w-4" /> Plan a hangout here
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LegendDot({ colorClass, label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="14" height="14" viewBox="0 0 14 14">
        <circle cx="7" cy="7" r="6" className={colorClass} stroke="#00205B" strokeWidth={1} />
      </svg>
      {label}
    </span>
  )
}
