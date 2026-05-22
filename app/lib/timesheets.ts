import 'server-only'

import { Redis } from '@upstash/redis'

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

type WeekStore = Record<string, Task[]>

const TOTAL_HOURS_PER_WEEK = 40

const redis = Redis.fromEnv()

const weekKey = (weekId: string) => `week:${weekId}`

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

function buildWeekSkeletons(year: number): Array<Omit<TimesheetWeek, 'days'> & { dates: string[] }> {
  const firstMonday = getFirstMondayOfYear(year)
  const currentMonday = getCurrentWeekMonday()
  const skeletons: Array<Omit<TimesheetWeek, 'days'> & { dates: string[] }> = []
  let weekNum = 1
  let monday = new Date(firstMonday)

  while (monday <= currentMonday && monday.getFullYear() <= year) {
    const weekId = `${year}-W${String(weekNum).padStart(2, '0')}`
    const dates: string[] = []
    for (let d = 0; d < 5; d++) {
      const dayDate = new Date(monday)
      dayDate.setDate(monday.getDate() + d)
      dates.push(toISODate(dayDate))
    }
    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)

    skeletons.push({
      weekId,
      weekNum,
      startDate: toISODate(monday),
      endDate: toISODate(friday),
      dates,
    })

    weekNum++
    monday = new Date(monday)
    monday.setDate(monday.getDate() + 7)
  }

  return skeletons
}

export async function generateWeeks(year: number): Promise<TimesheetWeek[]> {
  const skeletons = buildWeekSkeletons(year)
  if (skeletons.length === 0) return []

  const keys = skeletons.map((s) => weekKey(s.weekId))
  const stored = await redis.mget<(WeekStore | null)[]>(...keys)

  return skeletons.map((s, i) => {
    const weekStore = stored[i] ?? {}
    return {
      weekId: s.weekId,
      weekNum: s.weekNum,
      startDate: s.startDate,
      endDate: s.endDate,
      days: s.dates.map((date) => ({ date, tasks: weekStore[date] ?? [] })),
    }
  })
}

export async function getWeekById(weekId: string): Promise<TimesheetWeek | null> {
  const [yearStr] = weekId.split('-W')
  const year = parseInt(yearStr, 10)
  if (isNaN(year)) return null
  if (year !== new Date().getFullYear()) return null

  const skeleton = buildWeekSkeletons(year).find((s) => s.weekId === weekId)
  if (!skeleton) return null

  const weekStore = (await redis.get<WeekStore>(weekKey(weekId))) ?? {}
  return {
    weekId: skeleton.weekId,
    weekNum: skeleton.weekNum,
    startDate: skeleton.startDate,
    endDate: skeleton.endDate,
    days: skeleton.dates.map((date) => ({ date, tasks: weekStore[date] ?? [] })),
  }
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
  const skeletons = buildWeekSkeletons(year)
  return skeletons[skeletons.length - 1]?.weekId === weekId
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

export async function addTask(
  weekId: string,
  date: string,
  task: Omit<Task, 'id'>,
): Promise<Task> {
  const key = weekKey(weekId)
  const weekStore = (await redis.get<WeekStore>(key)) ?? {}
  const newTask: Task = { ...task, id: crypto.randomUUID() }
  weekStore[date] = [...(weekStore[date] ?? []), newTask]
  await redis.set(key, weekStore)
  return newTask
}

export async function updateTask(
  weekId: string,
  taskId: string,
  updates: Partial<Omit<Task, 'id'>>,
): Promise<Task | null> {
  const key = weekKey(weekId)
  const weekStore = await redis.get<WeekStore>(key)
  if (!weekStore) return null
  for (const date of Object.keys(weekStore)) {
    const tasks = weekStore[date]
    const idx = tasks.findIndex((t) => t.id === taskId)
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], ...updates }
      await redis.set(key, weekStore)
      return tasks[idx]
    }
  }
  return null
}

export async function deleteTask(weekId: string, taskId: string): Promise<boolean> {
  const key = weekKey(weekId)
  const weekStore = await redis.get<WeekStore>(key)
  if (!weekStore) return false
  for (const date of Object.keys(weekStore)) {
    const tasks = weekStore[date]
    const idx = tasks.findIndex((t) => t.id === taskId)
    if (idx !== -1) {
      tasks.splice(idx, 1)
      if (tasks.length === 0) delete weekStore[date]
      await redis.set(key, weekStore)
      return true
    }
  }
  return false
}
