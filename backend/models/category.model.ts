import { z } from 'zod';
import { validateSchema } from '../utils/validation';

export function validateModel(category: any) {
  const schema = z
    .object({
      name: z.string().min(3).max(10),
    })
    .passthrough();

  return validateSchema(schema, category);
}
