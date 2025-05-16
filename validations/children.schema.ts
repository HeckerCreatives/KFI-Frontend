import z from 'zod';

export const childrenSchema = z.object({
  name: z.string().min(1, 'Business Type is required'),
});

export type ChildrenFormData = z.infer<typeof childrenSchema>;
