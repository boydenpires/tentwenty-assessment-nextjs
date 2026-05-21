import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const key = new TextEncoder().encode(process.env.SESSION_SECRET)

type SessionPayload = {
  userId: string
  name: string
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function decrypt(token: string | undefined) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
    return payload
  } catch {
    return null
  }
}

export async function createSession(userId: string, name: string, rememberMe = false) {
  const expiresAt = new Date(Date.now() + (rememberMe ? 7 : 1) * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, name, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: rememberMe ? expiresAt : undefined,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function verifySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  const session = await decrypt(token)
  if (!session?.userId) return null
  return { userId: session.userId as string, name: session.name as string }
}
