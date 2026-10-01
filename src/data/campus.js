// Stylised campus layout + helpers for deriving "who's free where" from
// seeded timetables. No real geodata — positions are a schematic only.
import { OTHER_STUDENTS, HOURS } from './students.js'
import { TODAY, CURRENT_HOUR } from './hangouts.js'

export const BUILDINGS = [
  {
    id: 'queen-anne-court',
    name: 'Queen Anne Court',
    description: 'Queen Anne Court — business school & lecture theatres',
    onCampus: true,
    x: 190,
    y: 100,
    width: 210,
    height: 150,
    placeMatchers: [],
  },
  {
    id: 'king-william-court',
    name: 'King William Court',
    description: 'King William Court — humanities & social sciences',
    onCampus: true,
    x: 430,
    y: 100,
    width: 210,
    height: 150,
    placeMatchers: [],
  },
  {
    id: 'dreadnought',
    name: 'Dreadnought',
    description: 'Dreadnought — student services & health sciences',
    onCampus: true,
    x: 190,
    y: 280,
    width: 210,
    height: 150,
    placeMatchers: [],
  },
  {
    id: 'stockwell-street',
    name: 'Stockwell Street',
    description: 'Stockwell Street — architecture, art & design',
    onCampus: true,
    x: 430,
    y: 280,
    width: 210,
    height: 150,
    placeMatchers: ['Campus café, Stockwell Street'],
  },
  {
    id: 'greenwich-market',
    name: 'Greenwich Market',
    description: 'Greenwich Market — food stalls & shops, a short walk from campus',
    onCampus: false,
    x: 30,
    y: 250,
    width: 130,
    height: 100,
    placeMatchers: ['Greenwich Market', "Nando's, Greenwich", 'Whale Tea, Greenwich'],
  },
  {
    id: 'greenwich-park',
    name: 'Greenwich Park',
    description: 'Greenwich Park — green space for a walk, a picnic or some air',
    onCampus: false,
    x: 710,
    y: 80,
    width: 260,
    height: 380,
    placeMatchers: ['Greenwich Park', 'Cutty Sark Tavern'],
  },
]

export const VIEWBOX = { width: 1000, height: 640 }
export const CAMPUS_OUTLINE = { x: 160, y: 60, width: 500, height: 400 }
export const RIVER = { y: 600, height: 30 }

export function buildingById(id) {
  return BUILDINGS.find((b) => b.id === id)
}

// Small deterministic string hash so a given student always lands on the
// same building rather than jumping around on every render.
function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

export function buildingForStudent(studentId) {
  const idx = hashString(studentId) % BUILDINGS.length
  return BUILDINGS[idx]
}

// Groups students who are free right now (per the demo clock in
// data/hangouts.js) by the building they've been deterministically
// assigned to.
export function freeStudentsByBuilding() {
  const slotIdx = HOURS.indexOf(CURRENT_HOUR)
  const byBuilding = {}
  BUILDINGS.forEach((b) => {
    byBuilding[b.id] = []
  })
  OTHER_STUDENTS.forEach((student) => {
    const status = student.timetable[TODAY]?.[slotIdx]
    if (status !== 'free') return
    const building = buildingForStudent(student.id)
    byBuilding[building.id].push(student)
  })
  return byBuilding
}

export function dotColorClass(count) {
  if (count >= 5) return 'fill-navy-900'
  if (count >= 3) return 'fill-teal-500'
  if (count >= 1) return 'fill-teal-200'
  return null
}

export function hangoutsNearBuilding(hangouts, building) {
  return hangouts.filter(
    (h) => h.place === building.name || building.placeMatchers.includes(h.place),
  )
}
