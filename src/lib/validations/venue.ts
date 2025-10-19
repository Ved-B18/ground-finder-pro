import { z } from "zod";

export const venueSchema = z.object({
  // Basic Info
  name: z
    .string()
    .trim()
    .min(1, { message: "Venue name is required" })
    .max(200, { message: "Name must be less than 200 characters" }),
  sport: z
    .string()
    .trim()
    .min(1, { message: "Sport type is required" })
    .max(50, { message: "Sport type must be less than 50 characters" }),
  venue_type: z.string().max(50).optional(),
  surface_type: z.string().max(50).optional(),
  description: z
    .string()
    .max(5000, { message: "Description must be less than 5000 characters" })
    .optional(),
  capacity: z
    .number()
    .int({ message: "Capacity must be a whole number" })
    .positive({ message: "Capacity must be positive" })
    .max(10000, { message: "Capacity seems unreasonably large" })
    .optional()
    .nullable(),

  // Location
  address: z.string().trim().max(500).optional(),
  city: z.string().trim().max(100).optional(),
  postal_code: z.string().trim().max(20).optional(),
  location: z.string().trim().min(1, { message: "Location is required" }).max(200),
  latitude: z
    .number()
    .min(-90, { message: "Invalid latitude" })
    .max(90, { message: "Invalid latitude" })
    .optional()
    .nullable(),
  longitude: z
    .number()
    .min(-180, { message: "Invalid longitude" })
    .max(180, { message: "Invalid longitude" })
    .optional()
    .nullable(),
  directions_notes: z.string().max(1000).optional(),

  // Facilities
  lighting_available: z.boolean().optional(),
  parking_available: z.boolean().optional(),
  changing_rooms: z.boolean().optional(),
  equipment_provided: z.array(z.string().max(100)).optional(),
  extra_services: z.array(z.string().max(100)).optional(),
  safety_measures: z.array(z.string().max(100)).optional(),
  amenities: z.array(z.string().max(100)).optional(),
  accessibility_features: z.array(z.string().max(100)).optional(),

  // Pricing
  price_per_hour: z
    .number()
    .positive({ message: "Price must be positive" })
    .max(100000, { message: "Price seems unreasonably large" }),
  hourly_rate: z
    .number()
    .positive({ message: "Hourly rate must be positive" })
    .max(100000, { message: "Hourly rate seems unreasonably large" })
    .optional()
    .nullable(),
  weekend_rate: z
    .number()
    .positive({ message: "Weekend rate must be positive" })
    .max(100000, { message: "Weekend rate seems unreasonably large" })
    .optional()
    .nullable(),
  discount_percentage: z
    .number()
    .int()
    .min(0, { message: "Discount cannot be negative" })
    .max(100, { message: "Discount cannot exceed 100%" })
    .optional(),
  deposit_required: z.boolean().optional(),
  deposit_amount: z
    .number()
    .nonnegative({ message: "Deposit cannot be negative" })
    .max(100000, { message: "Deposit seems unreasonably large" })
    .optional()
    .nullable(),
  cancellation_policy: z.string().max(50).optional(),
  operating_hours_start: z.string().optional().nullable(),
  operating_hours_end: z.string().optional().nullable(),

  // Media
  cover_photo: z.string().url().optional().nullable(),
  images: z.array(z.string().url()).optional(),
  video_url: z.string().url().optional().nullable(),

  // Policies
  house_rules: z.string().max(2000).optional(),
  age_restriction: z.string().max(50).optional(),
  weather_policy: z.string().max(50).optional(),
  additional_notes: z.string().max(2000).optional(),

  // Other
  unavailable_dates: z.array(z.string()).optional(),
  sport_emoji: z.string().max(10).optional().nullable(),
});

export type VenueInput = z.infer<typeof venueSchema>;

// Partial validation for draft saves (only validate provided fields)
export const venueDraftSchema = venueSchema.partial();
