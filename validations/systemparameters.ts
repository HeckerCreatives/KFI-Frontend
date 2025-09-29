import z from 'zod';

export const systemparamsSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  preparedBy: z.string().optional(),
  approvedBy: z.string().min(1, 'Approved by is required'),
  checkedBy: z.string().min(1, 'Checked by is required'),
  receivedBy: z.string().optional(),
});

export type SystemParamsFormData = z.infer<typeof systemparamsSchema>;
