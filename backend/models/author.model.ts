import { z } from 'zod';
import { validateSchema } from '../utils/validation';

export function validateModel(author: any) {
  const schema = z
    .object({
      name: z.string().min(3).max(50),
      profession: z.string().min(3).max(50),
      image: z.string().optional().nullable(),
      mobile: z.string().optional().nullable(),
      email: z.string().min(5).max(255).email().optional().nullable(),
    })
    .passthrough();

  return validateSchema(schema, author);
}
