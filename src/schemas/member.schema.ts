import { z } from 'zod';

export const createMemberSchema = z.object({
  documentNumber: z
    .string()
    .min(5, 'El número de documento debe tener al menos 5 dígitos')
    .max(20, 'El documento no puede superar 20 caracteres')
    .trim(),
  documentType: z.enum(['CC', 'TI', 'CE', 'PASSPORT']).default('CC'),
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100)
    .trim(),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100)
    .trim(),
  phone: z
    .string()
    .max(20)
    .optional()
    .nullable(),
  email: z
    .string()
    .email('Formato de correo electrónico inválido')
    .max(150)
    .optional()
    .nullable(),
  emergencyContactName: z
    .string()
    .max(120)
    .optional()
    .nullable(),
  emergencyContactPhone: z
    .string()
    .max(20)
    .optional()
    .nullable(),
  medicalNotes: z
    .string()
    .optional()
    .nullable(),
});

export const updateMemberSchema = createMemberSchema.partial().extend({
  status: z.enum(['active', 'inactive', 'banned']).optional(),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
