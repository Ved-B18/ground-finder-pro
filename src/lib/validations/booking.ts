import { z } from "zod";

export const checkoutRequestSchema = z.object({
  bookingId: z
    .string()
    .uuid({ message: "Invalid booking ID format" }),
  amount: z
    .number()
    .positive({ message: "Amount must be positive" })
    .max(100000, { message: "Amount exceeds maximum limit" }),
  venueName: z
    .string()
    .trim()
    .min(1, { message: "Venue name is required" })
    .max(200, { message: "Venue name too long" }),
  bookingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format (use YYYY-MM-DD)" }),
  timeSlot: z
    .string()
    .trim()
    .min(1, { message: "Time slot is required" })
    .max(50, { message: "Time slot too long" }),
});

export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>;
