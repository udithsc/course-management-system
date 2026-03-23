import { z } from 'zod';

/**
 * Standard Zod validation helper to ensure consistent error formatting.
 */
export function validateSchema(schema: z.ZodSchema, data: any) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      error: {
        details: [{ message: result.error.issues[0].message }],
      },
      value: null,
    };
  }
  return { error: null, value: result.data };
}
