export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          created_at: string | null
          credits_earned: number | null
          credits_used: number | null
          id: string
          price: number
          status: string
          time_slot: string
          updated_at: string | null
          user_id: string
          venue_id: string
        }
        Insert: {
          booking_date: string
          created_at?: string | null
          credits_earned?: number | null
          credits_used?: number | null
          id?: string
          price: number
          status?: string
          time_slot: string
          updated_at?: string | null
          user_id: string
          venue_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string | null
          credits_earned?: number | null
          credits_used?: number | null
          id?: string
          price?: number
          status?: string
          time_slot?: string
          updated_at?: string | null
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string | null
          credits_earned: number
          id: string
          payment_status: string
          user_id: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string | null
          credits_earned: number
          id?: string
          payment_status?: string
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string | null
          credits_earned?: number
          id?: string
          payment_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          credits: number | null
          full_name: string
          id: string
          preferred_sports: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          credits?: number | null
          full_name: string
          id: string
          preferred_sports?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          credits?: number | null
          full_name?: string
          id?: string
          preferred_sports?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          user_id: string
          venue_id: string
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          user_id: string
          venue_id: string
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          accessibility_features: string[] | null
          additional_notes: string | null
          address: string | null
          age_restriction: string | null
          amenities: string[] | null
          cancellation_policy: string | null
          capacity: number | null
          changing_rooms: boolean | null
          city: string | null
          cover_photo: string | null
          created_at: string | null
          deposit_amount: number | null
          deposit_required: boolean | null
          description: string | null
          directions_notes: string | null
          discount_percentage: number | null
          equipment_provided: string[] | null
          extra_services: string[] | null
          host_id: string
          hourly_rate: number | null
          house_rules: string | null
          id: string
          images: string[] | null
          latitude: number | null
          lighting_available: boolean | null
          location: string
          longitude: number | null
          name: string
          operating_hours_end: string | null
          operating_hours_start: string | null
          parking_available: boolean | null
          postal_code: string | null
          price_per_hour: number
          rating: number | null
          safety_measures: string[] | null
          sport: string
          sport_emoji: string | null
          status: string | null
          stripe_account_id: string | null
          surface_type: string | null
          total_reviews: number | null
          unavailable_dates: string[] | null
          updated_at: string | null
          venue_type: string | null
          video_url: string | null
          weather_policy: string | null
          weekend_rate: number | null
        }
        Insert: {
          accessibility_features?: string[] | null
          additional_notes?: string | null
          address?: string | null
          age_restriction?: string | null
          amenities?: string[] | null
          cancellation_policy?: string | null
          capacity?: number | null
          changing_rooms?: boolean | null
          city?: string | null
          cover_photo?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          deposit_required?: boolean | null
          description?: string | null
          directions_notes?: string | null
          discount_percentage?: number | null
          equipment_provided?: string[] | null
          extra_services?: string[] | null
          host_id: string
          hourly_rate?: number | null
          house_rules?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          lighting_available?: boolean | null
          location: string
          longitude?: number | null
          name: string
          operating_hours_end?: string | null
          operating_hours_start?: string | null
          parking_available?: boolean | null
          postal_code?: string | null
          price_per_hour: number
          rating?: number | null
          safety_measures?: string[] | null
          sport: string
          sport_emoji?: string | null
          status?: string | null
          stripe_account_id?: string | null
          surface_type?: string | null
          total_reviews?: number | null
          unavailable_dates?: string[] | null
          updated_at?: string | null
          venue_type?: string | null
          video_url?: string | null
          weather_policy?: string | null
          weekend_rate?: number | null
        }
        Update: {
          accessibility_features?: string[] | null
          additional_notes?: string | null
          address?: string | null
          age_restriction?: string | null
          amenities?: string[] | null
          cancellation_policy?: string | null
          capacity?: number | null
          changing_rooms?: boolean | null
          city?: string | null
          cover_photo?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          deposit_required?: boolean | null
          description?: string | null
          directions_notes?: string | null
          discount_percentage?: number | null
          equipment_provided?: string[] | null
          extra_services?: string[] | null
          host_id?: string
          hourly_rate?: number | null
          house_rules?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          lighting_available?: boolean | null
          location?: string
          longitude?: number | null
          name?: string
          operating_hours_end?: string | null
          operating_hours_start?: string | null
          parking_available?: boolean | null
          postal_code?: string | null
          price_per_hour?: number
          rating?: number | null
          safety_measures?: string[] | null
          sport?: string
          sport_emoji?: string | null
          status?: string | null
          stripe_account_id?: string | null
          surface_type?: string | null
          total_reviews?: number | null
          unavailable_dates?: string[] | null
          updated_at?: string | null
          venue_type?: string | null
          video_url?: string | null
          weather_policy?: string | null
          weekend_rate?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      process_successful_payment: {
        Args: { p_booking_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "player" | "host"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["player", "host"],
    },
  },
} as const
