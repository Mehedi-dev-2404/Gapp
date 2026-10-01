// Seeded mock data for Gapp. No real people — names and schedules are invented for demo purposes.

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
export const DAY_LABELS = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
}
// Each slot is a 1-hour block; HOURS[i] is the start hour of slot i.
export const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17]

export function slotLabel(hour) {
  const fmt = (h) => `${String(h).padStart(2, '0')}:00`
  return `${fmt(hour)}–${fmt(hour + 1)}`
}

// Converts a 9-character pattern of 'C' (class) / 'F' (free) into a slot array.
function pattern(str) {
  if (str.length !== HOURS.length) {
    throw new Error(`Pattern "${str}" must have ${HOURS.length} characters`)
  }
  return str.split('').map((c) => (c === 'C' ? 'class' : 'free'))
}

function timetable(mon, tue, wed, thu, fri) {
  return {
    Mon: pattern(mon),
    Tue: pattern(tue),
    Wed: pattern(wed),
    Thu: pattern(thu),
    Fri: pattern(fri),
  }
}

export const COURSES = [
  'BSc Computer Science',
  'BSc Business',
  'BSc Nursing',
  'BA Architecture',
  'LLB Law',
  'BEng Engineering',
  'BSc Psychology',
]

export const CAMPUS_LOCATIONS = [
  'Stockwell Street',
  'Dreadnought',
  'Queen Anne Court',
  'King William Court',
]

// Distinct avatar colours — kept away from a single purple-gradient palette.
const PALETTE = [
  '#1CB5B0', '#C2410C', '#7C3AED', '#0891B2', '#B45309',
  '#15803D', '#BE185D', '#4338CA', '#A16207', '#0E7490',
  '#B91C1C', '#047857', '#6D28D9', '#CA8A04', '#DB2777', '#166534',
]

function initialsOf(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// The signed-in demo user. Timetable is intentionally built so several
// friends on different courses share free time with Sam during the week.
const RAW_STUDENTS = [
  {
    id: 'me',
    name: 'Sam Carter',
    course: 'BSc Computer Science',
    year: 2,
    isMe: true,
    tt: timetable('CCFFCCFFF', 'FCCFCCCFF', 'FFFCCFFFF', 'CFCCFCCFF', 'FFCCFFFFF'),
  },
  {
    id: 's2',
    name: 'Priya Nair',
    course: 'BSc Business',
    year: 2,
    tt: timetable('CCFFCCCFF', 'FFCCCFFCC', 'CCFFFCFCF', 'FCCFCFFCC', 'CFFCCCFFF'),
  },
  {
    id: 's3',
    name: 'Jordan Blake',
    course: 'BSc Nursing',
    year: 1,
    tt: timetable('CFCCFCCFF', 'CCFCFCCFF', 'FFFCCCFCC', 'CCFFCFCFC', 'FCCFCFFFC'),
  },
  {
    id: 's4',
    name: 'Elena Marsh',
    course: 'BA Architecture',
    year: 3,
    tt: timetable('FCCFFCCCF', 'CCFFCFCFC', 'CFCCFCFCF', 'FFCCFCCFF', 'CFCCFFFFC'),
  },
  {
    id: 's5',
    name: 'Tobi Adeyemi',
    course: 'BEng Engineering',
    year: 2,
    tt: timetable('CCCFFCCFF', 'FCCFCCFFC', 'CFFCCFCFF', 'CCFFCCFFF', 'FFCCFCFCF'),
  },
  {
    id: 's6',
    name: 'Maya Lindqvist',
    course: 'LLB Law',
    year: 1,
    tt: timetable('FFCCCFCFC', 'CFCCFCCFF', 'CCFFCCFCF', 'FCCFFCCFF', 'CCFFCFFFF'),
  },
  {
    id: 's7',
    name: 'Daniel Osei',
    course: 'BSc Psychology',
    year: 3,
    tt: timetable('CFFCCFCFC', 'CCFFCFCCF', 'FFCCFCFCC', 'FFCCFCCFF', 'CFCCFFFFF'),
  },
  {
    id: 's8',
    name: 'Chloe Whitfield',
    course: 'BSc Computer Science',
    year: 2,
    tt: timetable('CCFFCCFCF', 'FCCFCFCFC', 'FFFCCFFCF', 'CFCCFCCFF', 'FCFCCFFFF'),
  },
  {
    id: 's9',
    name: 'Rui Zhang',
    course: 'BSc Business',
    year: 1,
    tt: timetable('FCCFCCFCF', 'CCFFCFFCC', 'CFCCFFCFF', 'FFCCFCFCF', 'CFFCCFFFF'),
  },
  {
    id: 's10',
    name: 'Amara Okafor',
    course: 'BSc Nursing',
    year: 2,
    tt: timetable('CFCCFCFCF', 'FFCCFCCFF', 'CCFFFCFCC', 'CFCCFFCFF', 'FCCFCFFFF'),
  },
  {
    id: 's11',
    name: 'Luca Romano',
    course: 'BA Architecture',
    year: 1,
    tt: timetable('FCFCCFCCF', 'CFCCFFCFC', 'FFCCFCFCF', 'CCFFCFCFF', 'FFCCCFFFF'),
  },
  {
    id: 's12',
    name: 'Grace Mensah',
    course: 'BEng Engineering',
    year: 3,
    tt: timetable('CCFFFCCFC', 'FCCFCFCFC', 'CFFCCFCFF', 'FCCFFCCFF', 'CFCCFFFFF'),
  },
  {
    id: 's13',
    name: 'Isabelle Petit',
    course: 'LLB Law',
    year: 2,
    tt: timetable('FFCCCFFCF', 'CCFFCFCCF', 'FCCFCFFCF', 'CFFCCFCFF', 'CCFFFFCFF'),
  },
  {
    id: 's14',
    name: 'Noah Fitzgerald',
    course: 'BSc Psychology',
    year: 1,
    tt: timetable('CFCFCCFCF', 'FCCFFCCFC', 'CCFFCFCFF', 'FFCCFCCFF', 'FCFCCFFFF'),
  },
  {
    id: 's15',
    name: 'Hana Suzuki',
    course: 'BSc Computer Science',
    year: 3,
    tt: timetable('FCCFCCFFF', 'CFFCCFCFC', 'FFCCFCFCF', 'CCFFFCCFF', 'CFCCFFFFF'),
  },
  {
    id: 's16',
    name: 'Ola Kowalski',
    course: 'BSc Business',
    year: 2,
    tt: timetable('CCFCFCFCF', 'FFCCFCCFF', 'CFCCFFFCF', 'CFFCCFCFF', 'FCCFFFFFF'),
  },
]

export const STUDENTS = RAW_STUDENTS.map((s, i) => ({
  id: s.id,
  name: s.name,
  course: s.course,
  year: s.year,
  isMe: Boolean(s.isMe),
  initials: initialsOf(s.name),
  color: PALETTE[i % PALETTE.length],
  timetable: s.tt,
}))

export const ME = STUDENTS.find((s) => s.isMe)
export const OTHER_STUDENTS = STUDENTS.filter((s) => !s.isMe)

// Demo-only: these two are shown as "live free right now" alongside the
// user whenever they go live, regardless of the actual clock.
export const LIVE_NOW_DEMO_IDS = ['s2', 's5']

export function studentById(id) {
  return STUDENTS.find((s) => s.id === id)
}
