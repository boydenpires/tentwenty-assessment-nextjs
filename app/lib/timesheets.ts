import 'server-only'

import { STATUS, type Status } from '@/app/types'

export type { Status }

export interface Task {
  id: string
  description: string
  hours: number
  projectName: string
  workType: string
}

export interface TimesheetDay {
  date: string
  tasks: Task[]
}

export interface TimesheetWeek {
  weekId: string
  weekNum: number
  startDate: string
  endDate: string
  days: TimesheetDay[]
}

const TOTAL_HOURS_PER_WEEK = 40

// In-memory store: weekId -> Map<date, Task[]>
const store = new Map<string, Map<string, Task[]>>()

function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getFirstMondayOfYear(year: number): Date {
  const jan1 = new Date(year, 0, 1)
  const dow = jan1.getDay() // 0 is Sun, 1 is Mon
  if (dow === 1) return jan1
  const daysUntilMonday = dow === 0 ? 1 : 8 - dow
  return new Date(year, 0, 1 + daysUntilMonday)
}

function getCurrentWeekMonday(): Date {
  const today = new Date()
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
  monday.setHours(0, 0, 0, 0)
  return monday
}

export function generateWeeks(year: number): TimesheetWeek[] {
  const firstMonday = getFirstMondayOfYear(year)
  const currentMonday = getCurrentWeekMonday()
  const weeks: TimesheetWeek[] = []
  let weekNum = 1
  let monday = new Date(firstMonday)

  while (monday <= currentMonday && monday.getFullYear() <= year) {
    const weekId = `${year}-W${String(weekNum).padStart(2, '0')}`
    const weekStore = store.get(weekId)
    const days: TimesheetDay[] = []

    for (let d = 0; d < 5; d++) {
      const dayDate = new Date(monday)
      dayDate.setDate(monday.getDate() + d)
      const dateStr = toISODate(dayDate)
      days.push({ date: dateStr, tasks: weekStore?.get(dateStr) ?? [] })
    }

    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)

    weeks.push({
      weekId,
      weekNum,
      startDate: toISODate(monday),
      endDate: toISODate(friday),
      days,
    })

    weekNum++
    monday = new Date(monday)
    monday.setDate(monday.getDate() + 7)
  }

  return weeks
}

export function getWeekById(weekId: string): TimesheetWeek | null {
  const [yearStr] = weekId.split('-W')
  const year = parseInt(yearStr, 10)
  if (isNaN(year)) return null
  if (year !== new Date().getFullYear()) return null
  return generateWeeks(year).find((w) => w.weekId === weekId) ?? null
}

export function computeWeekStats(week: TimesheetWeek) {
  let loggedHours = 0
  let taskCount = 0
  for (const day of week.days) {
    for (const task of day.tasks) {
      loggedHours += task.hours
      taskCount++
    }
  }
  return { loggedHours, totalHours: TOTAL_HOURS_PER_WEEK, taskCount }
}

export function getWeekStatus(loggedHours: number, taskCount: number): Status {
  if (taskCount === 0) return STATUS.MISSING
  if (loggedHours >= TOTAL_HOURS_PER_WEEK) return STATUS.COMPLETED
  return STATUS.INCOMPLETE
}

export function isCurrentWeek(weekId: string): boolean {
  const year = new Date().getFullYear()
  const weeks = generateWeeks(year)
  return weeks[weeks.length - 1]?.weekId === weekId
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(endDate + 'T00:00:00')
  const startDay = start.getDate()
  const endDay = end.getDate()
  const startMonth = start.toLocaleString('en-US', { month: 'long' })
  const endMonth = end.toLocaleString('en-US', { month: 'long' })
  const year = start.getFullYear()
  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth}, ${year}`
  }
  return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${year}`
}

export function formatDayLabel(date: string): string {
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' })
}

export function addTask(weekId: string, date: string, task: Omit<Task, 'id'>): Task {
  if (!store.has(weekId)) store.set(weekId, new Map())
  const weekStore = store.get(weekId)!
  if (!weekStore.has(date)) weekStore.set(date, [])
  const newTask: Task = { ...task, id: crypto.randomUUID() }
  weekStore.get(date)!.push(newTask)
  return newTask
}

export function updateTask(
  weekId: string,
  taskId: string,
  updates: Partial<Omit<Task, 'id'>>
): Task | null {
  const weekStore = store.get(weekId)
  if (!weekStore) return null
  for (const tasks of weekStore.values()) {
    const idx = tasks.findIndex((t) => t.id === taskId)
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], ...updates }
      return tasks[idx]
    }
  }
  return null
}

export function deleteTask(weekId: string, taskId: string): boolean {
  const weekStore = store.get(weekId)
  if (!weekStore) return false
  for (const tasks of weekStore.values()) {
    const idx = tasks.findIndex((t) => t.id === taskId)
    if (idx !== -1) {
      tasks.splice(idx, 1)
      return true
    }
  }
  return false
}
