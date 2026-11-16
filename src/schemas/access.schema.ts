import { z } from 'zod';

export const checkInSchema = z.object({
  documentNumber: z
    .string()
    .min(5, 'El número de documento debe tener al menos 5 dígitos')
    .max(20)
    .trim(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;
