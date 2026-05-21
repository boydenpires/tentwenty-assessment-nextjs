import { NextRequest, NextResponse } from 'next/server'
import { updateTask, deleteTask } from '@/app/lib/timesheets'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ weekId: string; taskId: string }> }
) {
  const { weekId, taskId } = await params
  const body = await req.json()
  const task = updateTask(weekId, taskId, body)

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json({ task })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ weekId: string; taskId: string }> }
) {
  const { weekId, taskId } = await params
  const deleted = deleteTask(weekId, taskId)

  if (!deleted) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  return new Response(null, { status: 204 })
}
