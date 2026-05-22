import { NextResponse } from 'next/server'
import {
  generateWeeks,
  computeWeekStats,
  getWeekStatus,
  formatDateRange,
} from '@/app/lib/timesheets'
import { STATUS, SORT, type Status } from '@/app/types'
import { DEFAULT_PER_PAGE, DEFAULT_SORT } from '@/app/lib/constants'

const VALID_STATUSES = new Set<string>(Object.values(STATUS))

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const statusParam = searchParams.get('status')
  const status: Status | null =
    statusParam && VALID_STATUSES.has(statusParam)
      ? (statusParam as Status)
      : null
  const sortParam = searchParams.get('sort')
  const sort =
    sortParam === SORT.ASC || sortParam === SORT.DESC
      ? sortParam
      : DEFAULT_SORT
  const requestedPage = Math.max(
    1,
    Number(searchParams.get('page')) || 1,
  )
  const perPage = Math.max(
    1,
    Number(searchParams.get('perPage')) || DEFAULT_PER_PAGE,
  )

  const year = new Date().getFullYear()
  const all = (await generateWeeks(year)).map((week) => {
    const { loggedHours, totalHours, taskCount } = computeWeekStats(week)
    return {
      weekId: week.weekId,
      weekNum: week.weekNum,
      dateRange: formatDateRange(week.startDate, week.endDate),
      status: getWeekStatus(loggedHours, taskCount),
      loggedHours,
      totalHours,
    }
  })

  const filtered = status ? all.filter((w) => w.status === status) : all
  const sorted = filtered.sort((a, b) =>
    sort === SORT.ASC ? a.weekNum - b.weekNum : b.weekNum - a.weekNum,
  )

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const page = Math.min(requestedPage, totalPages)
  const start = (page - 1) * perPage
  const weeks = sorted.slice(start, start + perPage)

  return NextResponse.json({ weeks, page, perPage, total, totalPages })
}
