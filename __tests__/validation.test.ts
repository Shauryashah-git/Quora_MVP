import { validateEmail, validatePassword, sanitizeInput } from '@/lib/validation'

describe('validation utilities', () => {
  test('validateEmail recognizes valid email', () => {
    expect(validateEmail('test@example.com').isValid).toBe(true)
  })
  test('validateEmail rejects invalid email', () => {
    expect(validateEmail('bad-email').isValid).toBe(false)
  })
  test('validatePassword basic strength', () => {
    expect(validatePassword('abc123').isValid).toBe(true)
    expect(validatePassword('short').isValid).toBe(false)
  })
  test('sanitizeInput strips script tags', () => {
    expect(sanitizeInput('<script>alert(1)</script>Hi')).toBe('Hi')
  })
})
