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
      advertisers: {
        Row: {
          created_at: string
          description: string | null
          email: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          paid_until: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          email: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          paid_until?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          paid_until?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      avatars_cache: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          fetched_at: string
          person_id: string
          platform: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          fetched_at?: string
          person_id: string
          platform: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          fetched_at?: string
          person_id?: string
          platform?: string
          username?: string | null
        }
        Relationships: []
      }
      email_template_advertisers: {
        Row: {
          ad_content: string | null
          advertiser_id: string
          created_at: string
          email_template_id: string
          id: string
          is_active: boolean
          position: number
        }
        Insert: {
          ad_content?: string | null
          advertiser_id: string
          created_at?: string
          email_template_id: string
          id?: string
          is_active?: boolean
          position?: number
        }
        Update: {
          ad_content?: string | null
          advertiser_id?: string
          created_at?: string
          email_template_id?: string
          id?: string
          is_active?: boolean
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "email_template_advertisers_advertiser_id_fkey"
            columns: ["advertiser_id"]
            isOneToOne: false
            referencedRelation: "advertisers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_template_advertisers_email_template_id_fkey"
            columns: ["email_template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string
          id: string
          is_active: boolean
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          html_content: string
          id?: string
          is_active?: boolean
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          html_content?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      person_cache: {
        Row: {
          data_json: Json
          fetched_at: string
          person_id: string
          platform: string
        }
        Insert: {
          data_json: Json
          fetched_at?: string
          person_id: string
          platform: string
        }
        Update: {
          data_json?: Json
          fetched_at?: string
          person_id?: string
          platform?: string
        }
        Relationships: []
      }
      sb_new_entries: {
        Row: {
          created_at: string
          display_name: string | null
          handle: string | null
          id: number
          metrics: Json | null
          platform: string
          profile_id: string
          rank: number | null
          run_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          handle?: string | null
          id?: number
          metrics?: Json | null
          platform: string
          profile_id: string
          rank?: number | null
          run_at: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          handle?: string | null
          id?: number
          metrics?: Json | null
          platform?: string
          profile_id?: string
          rank?: number | null
          run_at?: string
        }
        Relationships: []
      }
      sb_rollups: {
        Row: {
          created_at: string
          id: number
          notes: string | null
          run_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          notes?: string | null
          run_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          notes?: string | null
          run_at?: string
        }
        Relationships: []
      }
      sb_snapshots: {
        Row: {
          created_at: string
          id: number
          items: Json
          platform: string
          run_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          items: Json
          platform: string
          run_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          items?: Json
          platform?: string
          run_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      top_cache: {
        Row: {
          data_json: Json
          delta_json: Json | null
          fetched_at: string
          metric: string
          page: number
          platform: string
          week_start: string
        }
        Insert: {
          data_json: Json
          delta_json?: Json | null
          fetched_at?: string
          metric: string
          page?: number
          platform: string
          week_start: string
        }
        Update: {
          data_json?: Json
          delta_json?: Json | null
          fetched_at?: string
          metric?: string
          page?: number
          platform?: string
          week_start?: string
        }
        Relationships: []
      }
      top_snapshots: {
        Row: {
          created_at: string
          data_json: Json
          fetched_at: string
          limit_size: number
          platform: string
          week_start: string
        }
        Insert: {
          created_at?: string
          data_json: Json
          fetched_at?: string
          limit_size?: number
          platform: string
          week_start: string
        }
        Update: {
          created_at?: string
          data_json?: Json
          fetched_at?: string
          limit_size?: number
          platform?: string
          week_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      top_cache_latest: {
        Row: {
          data_json: Json | null
          delta_json: Json | null
          fetched_at: string | null
          metric: string | null
          page: number | null
          platform: string | null
          week_start: string | null
        }
        Relationships: []
      }
      top_cache_latest_with_delta: {
        Row: {
          avatar: string | null
          current_value: number | null
          diff_value: number | null
          display_name: string | null
          fetched_at: string | null
          metric: string | null
          page: number | null
          person_id: string | null
          platform: string | null
          prev_value: number | null
          username: string | null
          week_start: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
