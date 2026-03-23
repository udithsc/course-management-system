import { z } from 'zod';
import { validateSchema } from '../utils/validation';

export function validateModel(course: any) {
  const schema = z
    .object({
      name: z.string().min(3).max(50),
      description: z.string().min(3).max(255),
      fee: z
        .number()
        .or(z.string().transform((val) => Number(val)))
        .refine((val) => !isNaN(val) && val >= 0 && val <= 100000, { message: 'Invalid fee' }),
      author: z.string(),
      category: z.string(),
      language: z.string().min(3).max(10).optional().nullable(),
    })
    .passthrough();

  return validateSchema(schema, course);
}
