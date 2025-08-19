import db from './db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const TOKEN_EXPIRY = '7d'

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  reputation: number
}

export function findUserByEmail(email: string): AuthUser | undefined {
  const row = db.prepare('SELECT id, name, email, avatar, bio, reputation FROM users WHERE email = ?').get(email)
  return row as AuthUser | undefined
}

export function findUserById(id: string): AuthUser | undefined {
  const row = db.prepare('SELECT id, name, email, avatar, bio, reputation FROM users WHERE id = ?').get(id)
  return row as AuthUser | undefined
}

export async function signup(name: string, email: string, password: string): Promise<AuthUser> {
  const existing = findUserByEmail(email)
  if (existing) throw new Error('Email already registered')
  const hash = await bcrypt.hash(password, 10)
  const id = randomUUID()
  db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?,?,?,?)').run(id, name, email, hash)
  return { id, name, email, reputation: 0 }
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any
  if (!row) throw new Error('Invalid credentials')
  const ok = await bcrypt.compare(password, row.password_hash)
  if (!ok) throw new Error('Invalid credentials')
  return { id: row.id, name: row.name, email: row.email, reputation: row.reputation, avatar: row.avatar, bio: row.bio }
}

export function createToken(user: AuthUser): string {
  return jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded.sub as string
  } catch {
    return null
  }
}
