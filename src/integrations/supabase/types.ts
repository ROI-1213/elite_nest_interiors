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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      enquiries: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string | null
          id: string
          message: string | null
          name: string
          phone: string
          service_id: string | null
          service_title: string | null
          source: string | null
          status: Database["public"]["Enums"]["enquiry_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name: string
          phone: string
          service_id?: string | null
          service_title?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string
          service_id?: string | null
          service_title?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          display_order: number
          features: Json
          gallery: Json
          id: string
          image_url: string | null
          is_active: boolean
          price_from: number | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          features?: Json
          gallery?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          price_from?: number | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          features?: Json
          gallery?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          price_from?: number | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          about_content: string | null
          about_image_url: string | null
          about_title: string | null
          address: string | null
          business_hours: string | null
          business_name: string
          cta_subtitle: string | null
          cta_title: string | null
          email: string | null
          facebook_url: string | null
          footer_about: string | null
          footer_copyright: string | null
          google_map_url: string | null
          hero_cta_label: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: number
          instagram_url: string | null
          linkedin_url: string | null
          mission_content: string | null
          phone: string | null
          pinterest_url: string | null
          tagline: string | null
          twitter_url: string | null
          updated_at: string
          vision_content: string | null
          vision_title: string | null
          whatsapp: string | null
          youtube_url: string | null
        }
        Insert: {
          about_content?: string | null
          about_image_url?: string | null
          about_title?: string | null
          address?: string | null
          business_hours?: string | null
          business_name?: string
          cta_subtitle?: string | null
          cta_title?: string | null
          email?: string | null
          facebook_url?: string | null
          footer_about?: string | null
          footer_copyright?: string | null
          google_map_url?: string | null
          hero_cta_label?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: number
          instagram_url?: string | null
          linkedin_url?: string | null
          mission_content?: string | null
          phone?: string | null
          pinterest_url?: string | null
          tagline?: string | null
          twitter_url?: string | null
          updated_at?: string
          vision_content?: string | null
          vision_title?: string | null
          whatsapp?: string | null
          youtube_url?: string | null
        }
        Update: {
          about_content?: string | null
          about_image_url?: string | null
          about_title?: string | null
          address?: string | null
          business_hours?: string | null
          business_name?: string
          cta_subtitle?: string | null
          cta_title?: string | null
          email?: string | null
          facebook_url?: string | null
          footer_about?: string | null
          footer_copyright?: string | null
          google_map_url?: string | null
          hero_cta_label?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: number
          instagram_url?: string | null
          linkedin_url?: string | null
          mission_content?: string | null
          phone?: string | null
          pinterest_url?: string | null
          tagline?: string | null
          twitter_url?: string | null
          updated_at?: string
          vision_content?: string | null
          vision_title?: string | null
          whatsapp?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_avatar_url: string | null
          author_location: string | null
          author_name: string
          content: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          project_image_url: string | null
          rating: number
          service_type: string | null
          updated_at: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_location?: string | null
          author_name: string
          content: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          project_image_url?: string | null
          rating?: number
          service_type?: string | null
          updated_at?: string
        }
        Update: {
          author_avatar_url?: string | null
          author_location?: string | null
          author_name?: string
          content?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          project_image_url?: string | null
          rating?: number
          service_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_testimonials: {
        Row: {
          author_name: string | null
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          author_name?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          author_name?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      enquiry_status: "new" | "contacted" | "in_progress" | "won" | "lost"
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
      app_role: ["admin", "user"],
      enquiry_status: ["new", "contacted", "in_progress", "won", "lost"],
    },
  },
} as const
