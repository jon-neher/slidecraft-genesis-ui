export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: []
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
        Relationships: []
      }
      hubspot_oauth_states: {
        Row: {
          created_at: string | null
          state: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          state: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          state?: string
          user_id?: string
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
            referencedRelation: "presentations"
            referencedColumns: ["presentation_id"]
          },
        ]
      }
      presentations: {
        Row: {
          completed_at: string | null
          context: Json | null
          created_at: string
          generated_file_url: string | null
          generation_status: Database["public"]["Enums"]["presentation_status_enum"]
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
          presentation_id?: string
          requested_at?: string
          started_at?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
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
            referencedRelation: "presentations"
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
      [_ in never]: never
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
