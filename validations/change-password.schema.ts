import { z } from "zod";

export const changePasswordSchema = z
  .object({
     password: z.string()
      .min(1, 'Password is required')
      .regex(
        /^[^-*/+`\\';./,]+$/,
        'Password contains invalid characters'
      ),
    confirm_password: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;