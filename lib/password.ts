// Lightweight password hashing using Web Crypto SHA-256 (NOT for production security)
// Provides async hashPassword / verifyPassword helpers
export async function hashPassword(plain: string): Promise<string> {
  const enc = new TextEncoder().encode(plain)
  const digest = await crypto.subtle.digest('SHA-256', enc)
  const hashArray = Array.from(new Uint8Array(digest))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  const hashed = await hashPassword(plain)
  return hashed === hash
}
