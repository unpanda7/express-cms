import { z } from 'zod';

export const createMenuSchema = z.object({
  name: z.string().min(1, 'Menu name is required'),
  code: z.string().min(1, 'Menu code is required'),
  parentId: z.number().optional(),
  sort: z.number().optional(),
  remark: z.string().optional()
});

export const updateMenuSchema = createMenuSchema.partial();

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
  sort: z.number().optional(),
  remark: z.string().optional(),
  permissionIds: z.array(z.number()).optional(),
  menuIds: z.array(z.number()).optional()
});

export const updateRoleSchema = createRoleSchema.partial();

export const updateUserSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^[0-9]{11}$/).optional(),
  status: z.boolean().optional(),
  remark: z.string().optional()
});

export const assignRoleSchema = z.object({
  roleIds: z.array(z.number())
});