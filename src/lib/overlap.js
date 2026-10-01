// Pure utility functions for comparing timetables. No React, no side effects.
import { DAYS, HOURS } from '../data/students.js'

/**
 * Turns a { Mon: ['class','free',...], ... } timetable into a list of
 * contiguous free blocks: [{ day, startHour, endHour, slots: [idx,...] }]
 */
export function freeBlocks(timetable) {
  const blocks = []
  for (const day of DAYS) {
    const slots = timetable[day] || []
    let current = null
    slots.forEach((status, i) => {
      if (status === 'free') {
        if (!current) {
          current = { day, startIdx: i, endIdx: i, slots: [i] }
        } else {
          current.endIdx = i
          current.slots.push(i)
        }
      } else if (current) {
        blocks.push(finalizeBlock(current))
        current = null
      }
    })
    if (current) blocks.push(finalizeBlock(current))
  }
  return blocks
}

function finalizeBlock(block) {
  return {
    day: block.day,
    startIdx: block.startIdx,
    endIdx: block.endIdx,
    startHour: HOURS[block.startIdx],
    endHour: HOURS[block.endIdx] + 1,
    slots: block.slots,
    lengthHours: block.slots.length,
  }
}

/**
 * Given the user's free blocks and another person's free blocks, returns
 * the overlapping portions as a list of { day, startHour, endHour, slots }.
 */
export function overlapWith(userBlocks, otherBlocks) {
  const overlaps = []
  for (const a of userBlocks) {
    for (const b of otherBlocks) {
      if (a.day !== b.day) continue
      const sharedSlots = a.slots.filter((s) => b.slots.includes(s))
      if (sharedSlots.length === 0) continue
      sharedSlots.sort((x, y) => x - y)
      overlaps.push({
        day: a.day,
        slots: sharedSlots,
        startIdx: sharedSlots[0],
        endIdx: sharedSlots[sharedSlots.length - 1],
        startHour: HOURS[sharedSlots[0]],
        endHour: HOURS[sharedSlots[sharedSlots.length - 1]] + 1,
        lengthHours: sharedSlots.length,
      })
    }
  }
  return overlaps
}

/**
 * Given a list of students (each with .timetable), returns a per-slot count
 * of how many of them are free, keyed as countsByDay[day][slotIdx] = number,
 * plus who[day][slotIdx] = [studentId, ...].
 */
export function overlapCounts(students) {
  const countsByDay = {}
  const whoByDay = {}
  for (const day of DAYS) {
    countsByDay[day] = HOURS.map(() => 0)
    whoByDay[day] = HOURS.map(() => [])
  }
  for (const student of students) {
    const tt = student.timetable
    if (!tt) continue
    for (const day of DAYS) {
      const slots = tt[day] || []
      slots.forEach((status, i) => {
        if (status === 'free') {
          countsByDay[day][i] += 1
          whoByDay[day][i].push(student.id)
        }
      })
    }
  }
  return { countsByDay, whoByDay }
}
