import { DAYS } from './students.js'

export const PLACES = [
  'Whale Tea, Greenwich',
  "Nando's, Greenwich",
  'Greenwich Market',
  'Cutty Sark Tavern',
  'Campus café, Stockwell Street',
  'Greenwich Park',
]

// Figures out "today" and "now" so a couple of seeded hangouts are always
// live when the demo runs, whatever day it happens to be.
const now = new Date()
const WEEKDAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const todayAbbr = WEEKDAY_ABBR[now.getDay()]
export const TODAY = DAYS.includes(todayAbbr) ? todayAbbr : 'Mon'
export const CURRENT_HOUR = Math.min(17, Math.max(9, now.getHours()))
const currentHour = CURRENT_HOUR

const RAW_HANGOUTS = [
  {
    id: 'h1',
    title: 'Bubble tea & catch-up',
    place: 'Whale Tea, Greenwich',
    day: TODAY,
    startHour: currentHour,
    endHour: currentHour + 1,
    hostId: 's2',
    attendeeIds: ['s2', 's9'],
    maxPeople: 6,
    visibility: 'public',
  },
  {
    id: 'h2',
    title: 'Peri-peri lunch run',
    place: "Nando's, Greenwich",
    day: TODAY,
    startHour: currentHour > 9 ? currentHour - 1 : currentHour,
    endHour: (currentHour > 9 ? currentHour - 1 : currentHour) + 2,
    hostId: 's5',
    attendeeIds: ['s5', 's12', 's7'],
    maxPeople: 5,
    visibility: 'public',
  },
  {
    id: 'h3',
    title: 'Market stroll before class',
    place: 'Greenwich Market',
    day: 'Mon',
    startHour: 11,
    endHour: 13,
    hostId: 's4',
    attendeeIds: ['s4'],
    maxPeople: 4,
    visibility: 'public',
  },
  {
    id: 'h4',
    title: 'Study break by the river',
    place: 'Cutty Sark Tavern',
    day: 'Mon',
    startHour: 15,
    endHour: 16,
    hostId: 's3',
    attendeeIds: ['s3', 's10'],
    maxPeople: 6,
    visibility: 'public',
  },
  {
    id: 'h5',
    title: 'Coffee + revision',
    place: 'Campus café, Stockwell Street',
    day: 'Tue',
    startHour: 9,
    endHour: 10,
    hostId: 's8',
    attendeeIds: ['s8'],
    maxPeople: 4,
    visibility: 'friends',
    invitedIds: ['me', 's15'],
  },
  {
    id: 'h6',
    title: 'Park walk, clear the head',
    place: 'Greenwich Park',
    day: 'Wed',
    startHour: 10,
    endHour: 11,
    hostId: 's11',
    attendeeIds: ['s11', 's13'],
    maxPeople: 8,
    visibility: 'public',
  },
  {
    id: 'h7',
    title: 'Pre-lecture tea',
    place: 'Whale Tea, Greenwich',
    day: 'Wed',
    startHour: 14,
    endHour: 15,
    hostId: 's9',
    attendeeIds: ['s9', 's16', 's6'],
    maxPeople: 5,
    visibility: 'public',
  },
  {
    id: 'h8',
    title: 'Nando\'s after seminar',
    place: "Nando's, Greenwich",
    day: 'Thu',
    startHour: 16,
    endHour: 17,
    hostId: 's14',
    attendeeIds: ['s14'],
    maxPeople: 6,
    visibility: 'public',
  },
  {
    id: 'h9',
    title: 'Market snacks & sunshine',
    place: 'Greenwich Market',
    day: 'Fri',
    startHour: 13,
    endHour: 14,
    hostId: 's4',
    attendeeIds: ['s4', 's11', 's2'],
    maxPeople: 6,
    visibility: 'public',
  },
  {
    id: 'h10',
    title: 'Friday wind-down',
    place: 'Cutty Sark Tavern',
    day: 'Fri',
    startHour: 16,
    endHour: 18,
    hostId: 's7',
    attendeeIds: ['s7', 's10', 's12'],
    maxPeople: 10,
    visibility: 'public',
  },
]

export const SEED_HANGOUTS = RAW_HANGOUTS.map((h) => ({
  invitedIds: [],
  ...h,
}))
