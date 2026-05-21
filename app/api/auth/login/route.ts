import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/app/lib/session'
import { USERS } from '@/app/lib/users'

export async function POST(request: NextRequest) {
  const { email, password, rememberMe } = await request.json()

  const user = USERS.find((u) => u.email === email)
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  if (user.password !== password) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  await createSession(user.id, user.name, rememberMe)
  return NextResponse.json({ success: true })
}
