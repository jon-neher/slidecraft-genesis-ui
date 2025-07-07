export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      blueprints: {
        Row: {
          audience: string | null
          blueprint: Json | null
          blueprint_id: string
          created_at: string
          extra_metadata: Json | null
          goal: string | null
          is_default: boolean
          name: string
          section_sequence: string[] | null
          slide_library: string[] | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audience?: string | null
          blueprint?: Json | null
          blueprint_id?: string
          created_at?: string
          extra_metadata?: Json | null
          goal?: string | null
          is_default?: boolean
          name: string
          section_sequence?: string[] | null
          slide_library?: string[] | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audience?: string | null
          blueprint?: Json | null
          blueprint_id?: string
          created_at?: string
          extra_metadata?: Json | null
          goal?: string | null
          is_default?: boolean
          name?: string
          section_sequence?: string[] | null
          slide_library?: string[] | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      hubspot_contacts_cache: {
        Row: {
          id: string
          portal_id: string
          properties: Json | null
          updated_at: string | null
        }
        Insert: {
          id: string
          portal_id: string
          properties?: Json | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          portal_id?: string
          properties?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hubspot_contacts_cache_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: false
            referencedRelation: "hubspot_tokens"
            referencedColumns: ["portal_id"]
          },
        ]
      }
      hubspot_events_raw: {
        Row: {
          id: number
          portal_id: string | null
          raw: Json | null
          received_at: string | null
        }
        Insert: {
          id?: number
          portal_id?: string | null
          raw?: Json | null
          received_at?: string | null
        }
        Update: {
          id?: number
          portal_id?: string | null
          raw?: Json | null
          received_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hubspot_events_raw_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: false
            referencedRelation: "hubspot_tokens"
            referencedColumns: ["portal_id"]
          },
        ]
      }
      hubspot_oauth_states: {
        Row: {
          created_at: string | null
          expires_at: string | null
          state: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          state: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          state?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hubspot_oauth_states_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hubspot_sync_cursors: {
        Row: {
          hs_timestamp: string | null
          object_type: string
          portal_id: string
        }
        Insert: {
          hs_timestamp?: string | null
          object_type: string
          portal_id: string
        }
        Update: {
          hs_timestamp?: string | null
          object_type?: string
          portal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hubspot_sync_cursors_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: false
            referencedRelation: "hubspot_tokens"
            referencedColumns: ["portal_id"]
          },
        ]
      }
      hubspot_tokens: {
        Row: {
          access_token: string | null
          expires_at: string | null
          portal_id: string
          refresh_token: string | null
          scope: string[] | null
        }
        Insert: {
          access_token?: string | null
          expires_at?: string | null
          portal_id: string
          refresh_token?: string | null
          scope?: string[] | null
        }
        Update: {
          access_token?: string | null
          expires_at?: string | null
          portal_id?: string
          refresh_token?: string | null
          scope?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "hubspot_tokens_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      presentation_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          input_id: string
          job_id: string
          presentation_id: string | null
          processing_steps: Json | null
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          input_id: string
          job_id?: string
          presentation_id?: string | null
          processing_steps?: Json | null
          started_at?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          input_id?: string
          job_id?: string
          presentation_id?: string | null
          processing_steps?: Json | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "presentation_jobs_input_id_fkey"
            columns: ["input_id"]
            isOneToOne: false
            referencedRelation: "presentations_input"
            referencedColumns: ["input_id"]
          },
          {
            foreignKeyName: "presentation_jobs_presentation_id_fkey"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "presentations_generated"
            referencedColumns: ["presentation_id"]
          },
        ]
      }
      presentation_plans: {
        Row: {
          created_at: string
          error_message: string | null
          plan_id: string
          plan_json: Json | null
          presentation_id: string
          status: Database["public"]["Enums"]["plan_status_enum"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          plan_id?: string
          plan_json?: Json | null
          presentation_id: string
          status?: Database["public"]["Enums"]["plan_status_enum"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          plan_id?: string
          plan_json?: Json | null
          presentation_id?: string
          status?: Database["public"]["Enums"]["plan_status_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "presentation_plans_presentation_id_fkey"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "presentations_generated"
            referencedColumns: ["presentation_id"]
          },
        ]
      }
      presentations_generated: {
        Row: {
          completed_at: string | null
          context: Json | null
          created_at: string
          generated_file_url: string | null
          generation_status: Database["public"]["Enums"]["presentation_status_enum"]
          input_id: string | null
          job_id: string | null
          presentation_id: string
          requested_at: string
          started_at: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          context?: Json | null
          created_at?: string
          generated_file_url?: string | null
          generation_status?: Database["public"]["Enums"]["presentation_status_enum"]
          input_id?: string | null
          job_id?: string | null
          presentation_id?: string
          requested_at?: string
          started_at?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          context?: Json | null
          created_at?: string
          generated_file_url?: string | null
          generation_status?: Database["public"]["Enums"]["presentation_status_enum"]
          input_id?: string | null
          job_id?: string | null
          presentation_id?: string
          requested_at?: string
          started_at?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "presentations_generated_input_id_fkey"
            columns: ["input_id"]
            isOneToOne: false
            referencedRelation: "presentations_input"
            referencedColumns: ["input_id"]
          },
          {
            foreignKeyName: "presentations_generated_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "presentation_jobs"
            referencedColumns: ["job_id"]
          },
        ]
      }
      presentations_input: {
        Row: {
          audience_info: Json | null
          context: Json | null
          created_at: string
          description: string | null
          input_id: string
          presentation_type: string | null
          slide_count_preference: number | null
          status: string
          template_preferences: Json | null
          title: string
          user_id: string
        }
        Insert: {
          audience_info?: Json | null
          context?: Json | null
          created_at?: string
          description?: string | null
          input_id?: string
          presentation_type?: string | null
          slide_count_preference?: number | null
          status?: string
          template_preferences?: Json | null
          title: string
          user_id: string
        }
        Update: {
          audience_info?: Json | null
          context?: Json | null
          created_at?: string
          description?: string | null
          input_id?: string
          presentation_type?: string | null
          slide_count_preference?: number | null
          status?: string
          template_preferences?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      presentations_revisions: {
        Row: {
          created_at: string
          created_by: string
          presentation_id: string
          slides: Json
          version: number
        }
        Insert: {
          created_at?: string
          created_by: string
          presentation_id: string
          slides: Json
          version: number
        }
        Update: {
          created_at?: string
          created_by?: string
          presentation_id?: string
          slides?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "presentations_revisions_presentation_id_fkey"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "presentations_generated"
            referencedColumns: ["presentation_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          metadata: Json | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          metadata?: Json | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          request_count: number | null
          user_id: string
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          request_count?: number | null
          user_id: string
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          request_count?: number | null
          user_id?: string
          window_start?: string | null
        }
        Relationships: []
      }
      section_templates: {
        Row: {
          created_at: string
          default_templates: string[]
          description: string | null
          name: string
          section_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_templates?: string[]
          description?: string | null
          name: string
          section_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_templates?: string[]
          description?: string | null
          name?: string
          section_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      slide_generations: {
        Row: {
          created_at: string
          error_message: string | null
          generation_id: string
          generation_status: Database["public"]["Enums"]["slide_status_enum"]
          md_rendered: string | null
          parsed_content: Json | null
          presentation_id: string
          raw_output: Json | null
          slide_index: number
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          generation_id?: string
          generation_status?: Database["public"]["Enums"]["slide_status_enum"]
          md_rendered?: string | null
          parsed_content?: Json | null
          presentation_id: string
          raw_output?: Json | null
          slide_index: number
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          generation_id?: string
          generation_status?: Database["public"]["Enums"]["slide_status_enum"]
          md_rendered?: string | null
          parsed_content?: Json | null
          presentation_id?: string
          raw_output?: Json | null
          slide_index?: number
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "slide_generations_presentation_id_fkey"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "presentations_generated"
            referencedColumns: ["presentation_id"]
          },
          {
            foreignKeyName: "slide_generations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "slide_templates"
            referencedColumns: ["template_id"]
          },
        ]
      }
      slide_templates: {
        Row: {
          created_at: string
          md_template: string
          name: string
          output_schema: Json
          prompt_template: string
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          md_template: string
          name: string
          output_schema: Json
          prompt_template: string
          template_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          md_template?: string
          name?: string
          output_schema?: Json
          prompt_template?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      themes: {
        Row: {
          created_at: string
          css: string
          description: string | null
          name: string
          theme_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          css?: string
          description?: string | null
          name: string
          theme_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          css?: string
          description?: string | null
          name?: string
          theme_id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_oauth_states: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      plan_status_enum: "pending" | "complete" | "failed"
      presentation_status_enum:
        | "pending"
        | "in_progress"
        | "complete"
        | "failed"
      slide_status_enum: "pending" | "in_progress" | "complete" | "failed"
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
      plan_status_enum: ["pending", "complete", "failed"],
      presentation_status_enum: [
        "pending",
        "in_progress",
        "complete",
        "failed",
      ],
      slide_status_enum: ["pending", "in_progress", "complete", "failed"],
    },
  },
} as const
