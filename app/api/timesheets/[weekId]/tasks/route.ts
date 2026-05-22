import { NextRequest, NextResponse } from 'next/server'
import { getWeekById, addTask } from '@/app/lib/timesheets'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ weekId: string }> }
) {
  const { weekId } = await params

  if (!(await getWeekById(weekId))) {
    return NextResponse.json({ error: 'Week not found' }, { status: 404 })
  }

  const body = await req.json()
  const { date, description, hours, projectName, workType } = body

  if (!date || !description || !hours || !projectName || !workType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const task = await addTask(weekId, date, {
    description,
    hours: Number(hours),
    projectName,
    workType,
  })

  return NextResponse.json({ task }, { status: 201 })
}
