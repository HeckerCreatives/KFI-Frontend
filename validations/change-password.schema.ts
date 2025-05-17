import z from 'zod';

export const changePasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirm_password: z.string().min(1, 'Confirm Password is required'),
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
