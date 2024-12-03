import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  username: z
    .string()
    .min(6, 'Username must be at least 2 characters')
    .max(50, 'Username is too long'),
  phone: z
    .string()
    .regex(/^[0-9]{11}$/, 'Phone number must be 11 digits')
})

export const loginSchema = z.object({
  username: z.string().min(6, 'Username must be at least 6 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

// 用于类型推断
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>