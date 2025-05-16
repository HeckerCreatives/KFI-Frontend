import z from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  confirm_password: z.string().min(1, 'Confirm Password is required'),
});

export type UserFormData = z.infer<typeof userSchema>;
