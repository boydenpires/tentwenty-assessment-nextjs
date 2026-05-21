export const USERS = [
  { id: '1', email: 'boyden@ticktock.com', password: 'password123', name: 'Boyd Pires' },
]

export type User = (typeof USERS)[number]
