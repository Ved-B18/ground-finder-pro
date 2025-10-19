import { z } from "zod";

export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Name can only contain letters, spaces, hyphens, and apostrophes" })
    .optional(),
  avatar_url: z
    .string()
    .url({ message: "Invalid avatar URL" })
    .optional()
    .nullable(),
  preferred_sports: z
    .array(
      z.string().max(50, { message: "Sport name too long" })
    )
    .max(20, { message: "Maximum 20 sports allowed" })
    .optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
