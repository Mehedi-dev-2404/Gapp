import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ME, DAYS } from '../data/students.js'
import { SEED_HANGOUTS } from '../data/hangouts.js'

const STORAGE_KEY = 'gapp:v1'
const DEFAULT_FRIEND_IDS = ['s2', 's3', 's4', 's5']
export const LIVE_FREE_DURATION_MS = 60 * 60 * 1000

function cloneTimetable(tt) {
  const copy = {}
  for (const day of DAYS) copy[day] = [...tt[day]]
  return copy
}

function defaultState() {
  return {
    myTimetable: cloneTimetable(ME.timetable),
    timetableSaved: true,
    hangouts: SEED_HANGOUTS,
    friendIds: DEFAULT_FRIEND_IDS,
    liveFreeStartedAt: null,
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    const base = defaultState()
    let liveFreeStartedAt = parsed.liveFreeStartedAt ?? null
    if (liveFreeStartedAt && Date.now() - liveFreeStartedAt >= LIVE_FREE_DURATION_MS) {
      liveFreeStartedAt = null
    }
    return {
      myTimetable: parsed.myTimetable || base.myTimetable,
      timetableSaved: parsed.timetableSaved ?? true,
      hangouts: parsed.hangouts || base.hangouts,
      friendIds: parsed.friendIds || base.friendIds,
      liveFreeStartedAt,
    }
  } catch {
    return defaultState()
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [createModal, setCreateModal] = useState({ open: false, prefill: null })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Auto-expire "live free" exactly when its hour is up, so the badge and
  // feed card disappear on their own even if the tab stays open.
  useEffect(() => {
    if (!state.liveFreeStartedAt) return undefined
    const remaining = LIVE_FREE_DURATION_MS - (Date.now() - state.liveFreeStartedAt)
    if (remaining <= 0) {
      setState((s) => ({ ...s, liveFreeStartedAt: null }))
      return undefined
    }
    const timer = setTimeout(() => {
      setState((s) => ({ ...s, liveFreeStartedAt: null }))
    }, remaining)
    return () => clearTimeout(timer)
  }, [state.liveFreeStartedAt])

  const api = useMemo(() => {
    return {
      ...state,
      isLiveFree: Boolean(state.liveFreeStartedAt),
      createModal,
      openCreateHangout(prefill = null) {
        setCreateModal({ open: true, prefill })
      },
      closeCreateHangout() {
        setCreateModal({ open: false, prefill: null })
      },

      toggleSlot(day, slotIdx) {
        setState((s) => {
          const slots = [...s.myTimetable[day]]
          slots[slotIdx] = slots[slotIdx] === 'free' ? 'class' : 'free'
          return {
            ...s,
            myTimetable: { ...s.myTimetable, [day]: slots },
            timetableSaved: false,
          }
        })
      },

      setSlotRange(day, slotIdxs, status) {
        setState((s) => {
          const slots = [...s.myTimetable[day]]
          slotIdxs.forEach((i) => {
            slots[i] = status
          })
          return {
            ...s,
            myTimetable: { ...s.myTimetable, [day]: slots },
            timetableSaved: false,
          }
        })
      },

      saveTimetable() {
        setState((s) => ({ ...s, timetableSaved: true }))
      },

      joinHangout(id) {
        setState((s) => ({
          ...s,
          hangouts: s.hangouts.map((h) =>
            h.id === id && !h.attendeeIds.includes('me') && h.attendeeIds.length < h.maxPeople
              ? { ...h, attendeeIds: [...h.attendeeIds, 'me'] }
              : h,
          ),
        }))
      },

      leaveHangout(id) {
        setState((s) => ({
          ...s,
          hangouts: s.hangouts.map((h) =>
            h.id === id ? { ...h, attendeeIds: h.attendeeIds.filter((a) => a !== 'me') } : h,
          ),
        }))
      },

      createHangout(data) {
        const id = `h_${Date.now()}`
        const hangout = {
          id,
          title: data.title,
          place: data.place,
          day: data.day,
          startHour: data.startHour,
          endHour: data.endHour,
          hostId: 'me',
          attendeeIds: ['me'],
          maxPeople: data.maxPeople,
          visibility: data.visibility,
          invitedIds: data.invitedIds || [],
        }
        setState((s) => ({ ...s, hangouts: [hangout, ...s.hangouts] }))
        return id
      },

      addFriend(id) {
        setState((s) =>
          s.friendIds.includes(id) ? s : { ...s, friendIds: [...s.friendIds, id] },
        )
      },

      removeFriend(id) {
        setState((s) => ({ ...s, friendIds: s.friendIds.filter((f) => f !== id) }))
      },

      resetDemo() {
        localStorage.removeItem(STORAGE_KEY)
        setState(defaultState())
      },

      toggleLiveFree() {
        setState((s) => ({ ...s, liveFreeStartedAt: s.liveFreeStartedAt ? null : Date.now() }))
      },

      cancelLiveFree() {
        setState((s) => ({ ...s, liveFreeStartedAt: null }))
      },
    }
  }, [state, createModal])

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
