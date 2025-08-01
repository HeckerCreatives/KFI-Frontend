import z from 'zod';

export const childrenSchema = z.object({
  name: z.string().min(1, 'Children Name is required').optional().or(z.literal('')),
});

export type ChildrenFormData = z.infer<typeof childrenSchema>;
