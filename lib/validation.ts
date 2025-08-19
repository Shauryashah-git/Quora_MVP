export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
}

// Question validation
export function validateQuestion(data: { title: string; content: string; tags: string[] }): ValidationResult {
  const errors: ValidationError[] = []

  // Title validation
  if (!data.title.trim()) {
    errors.push({ field: "title", message: "Title is required" })
  } else if (data.title.trim().length < 10) {
    errors.push({ field: "title", message: "Title must be at least 10 characters long" })
  } else if (data.title.trim().length > 200) {
    errors.push({ field: "title", message: "Title must be less than 200 characters" })
  }

  // Content validation
  if (!data.content.trim()) {
    errors.push({ field: "content", message: "Content is required" })
  } else if (data.content.trim().length < 20) {
    errors.push({ field: "content", message: "Content must be at least 20 characters long" })
  } else if (data.content.trim().length > 5000) {
    errors.push({ field: "content", message: "Content must be less than 5000 characters" })
  }

  // Tags validation
  if (data.tags.length > 5) {
    errors.push({ field: "tags", message: "Maximum 5 tags allowed" })
  }

  data.tags.forEach((tag, index) => {
    if (tag.length < 2) {
      errors.push({ field: "tags", message: `Tag "${tag}" must be at least 2 characters long` })
    } else if (tag.length > 20) {
      errors.push({ field: "tags", message: `Tag "${tag}" must be less than 20 characters` })
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Answer validation
export function validateAnswer(content: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!content.trim()) {
    errors.push({ field: "content", message: "Answer content is required" })
  } else if (content.trim().length < 10) {
    errors.push({ field: "content", message: "Answer must be at least 10 characters long" })
  } else if (content.trim().length > 10000) {
    errors.push({ field: "content", message: "Answer must be less than 10,000 characters" })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Comment validation
export function validateComment(content: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!content.trim()) {
    errors.push({ field: "content", message: "Comment is required" })
  } else if (content.trim().length < 3) {
    errors.push({ field: "content", message: "Comment must be at least 3 characters long" })
  } else if (content.trim().length > 500) {
    errors.push({ field: "content", message: "Comment must be less than 500 characters" })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Auth validation
export function validateEmail(email: string): ValidationResult {
  const errors: ValidationError[] = []
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email.trim()) {
    errors.push({ field: "email", message: "Email is required" })
  } else if (!emailRegex.test(email)) {
    errors.push({ field: "email", message: "Please enter a valid email address" })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validatePassword(password: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!password) {
    errors.push({ field: "password", message: "Password is required" })
  } else if (password.length < 8) {
    errors.push({ field: "password", message: "Password must be at least 8 characters long" })
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.push({
      field: "password",
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateName(name: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!name.trim()) {
    errors.push({ field: "name", message: "Name is required" })
  } else if (name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters long" })
  } else if (name.trim().length > 50) {
    errors.push({ field: "name", message: "Name must be less than 50 characters" })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
