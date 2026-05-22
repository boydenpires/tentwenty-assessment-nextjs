import { NextRequest, NextResponse } from 'next/server'
import {
  getWeekById,
  computeWeekStats,
  getWeekStatus,
  formatDateRange,
  formatDayLabel,
  isCurrentWeek,
} from '@/app/lib/timesheets'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ weekId: string }> }
) {
  const { weekId } = await params
  const week = await getWeekById(weekId)

  if (!week) {
    return NextResponse.json({ error: 'Week not found' }, { status: 404 })
  }

  const { loggedHours, totalHours, taskCount } = computeWeekStats(week)
  const status = getWeekStatus(loggedHours, taskCount)

  return NextResponse.json({
    week: {
      ...week,
      days: week.days.map((day) => ({ ...day, label: formatDayLabel(day.date) })),
      dateRange: formatDateRange(week.startDate, week.endDate),
      status,
      loggedHours,
      totalHours,
      isCurrent: isCurrentWeek(weekId),
    },
  })
}
