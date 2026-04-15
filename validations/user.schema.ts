import z from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(25, 'Name must be at most 25 characters'),
  username: z.string().min(1, 'Username is required').max(12, 'Username must be at most 12 characters'),
 password: z.string()
  .min(1, 'Password is required')
  .regex(
    /^[^-*/+`\\';./,]+$/,
    'Password contains invalid characters'
  ),
  confirm_password: z.string().min(1, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type UserFormData = z.infer<typeof userSchema>;
