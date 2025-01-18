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
      color_palettes: {
        Row: {
          color_names: Json | null
          colors: Json
          created_at: string
          id: string
          is_default: boolean | null
          is_favorite: boolean | null
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          color_names?: Json | null
          colors: Json
          created_at?: string
          id?: string
          is_default?: boolean | null
          is_favorite?: boolean | null
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          color_names?: Json | null
          colors?: Json
          created_at?: string
          id?: string
          is_default?: boolean | null
          is_favorite?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      fund_companies: {
        Row: {
          created_at: string
          description: string
          fund_company_name: string
          id: string
          imported_at: string
          updated_at: string
          website_url: string
        }
        Insert: {
          created_at?: string
          description: string
          fund_company_name: string
          id?: string
          imported_at?: string
          updated_at?: string
          website_url: string
        }
        Update: {
          created_at?: string
          description?: string
          fund_company_name?: string
          id?: string
          imported_at?: string
          updated_at?: string
          website_url?: string
        }
        Relationships: []
      }
      fund_contacts: {
        Row: {
          bio: string | null
          business_address: string | null
          company: string
          company_email: string | null
          company_id: string | null
          created_at: string
          full_name: string | null
          id: string
          imported_at: string
          linkedin_profile: string | null
          phone_number: string | null
          title: string | null
          updated_at: string
          website_url: string | null
          work_email: string | null
        }
        Insert: {
          bio?: string | null
          business_address?: string | null
          company: string
          company_email?: string | null
          company_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          imported_at?: string
          linkedin_profile?: string | null
          phone_number?: string | null
          title?: string | null
          updated_at?: string
          website_url?: string | null
          work_email?: string | null
        }
        Update: {
          bio?: string | null
          business_address?: string | null
          company?: string
          company_email?: string | null
          company_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          imported_at?: string
          linkedin_profile?: string | null
          phone_number?: string | null
          title?: string | null
          updated_at?: string
          website_url?: string | null
          work_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fund_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "fund_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_performance: {
        Row: {
          created_at: string
          date: string
          frequency: string
          fund_id: string | null
          fund_name: string
          id: string
          imported_at: string
          performance_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          frequency: string
          fund_id?: string | null
          fund_name: string
          id?: string
          imported_at?: string
          performance_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          frequency?: string
          fund_id?: string | null
          fund_name?: string
          id?: string
          imported_at?: string
          performance_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fund_performance_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
        ]
      }
      funds: {
        Row: {
          company_id: string
          created_at: string
          fund_name: string
          id: string
          imported_at: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          fund_name: string
          id?: string
          imported_at?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          fund_name?: string
          id?: string
          imported_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "funds_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "fund_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      index_performance: {
        Row: {
          created_at: string
          date: string
          id: string
          imported_at: string
          index_measures: string
          performance_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          imported_at?: string
          index_measures: string
          performance_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          imported_at?: string
          index_measures?: string
          performance_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      inflation_rates: {
        Row: {
          country_code: string
          country_name: string
          created_at: string
          date: string
          id: string
          imported_at: string
          inflation_value: number
          updated_at: string
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string
          date: string
          id?: string
          imported_at?: string
          inflation_value: number
          updated_at?: string
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string
          date?: string
          id?: string
          imported_at?: string
          inflation_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          amount: number
          created_at: string
          id: string
          name: string
          portfolio_id: string
          target_return: number | null
          type: Database["public"]["Enums"]["investment_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          name: string
          portfolio_id: string
          target_return?: number | null
          type: Database["public"]["Enums"]["investment_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          name?: string
          portfolio_id?: string
          target_return?: number | null
          type?: Database["public"]["Enums"]["investment_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projections: {
        Row: {
          created_at: string
          current_value: number
          data_type: Database["public"]["Enums"]["portfolio_data_type"]
          date: string
          id: string
          initial_value: number
          sp500_value: number
          traditional_value: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_value: number
          data_type: Database["public"]["Enums"]["portfolio_data_type"]
          date: string
          id?: string
          initial_value: number
          sp500_value: number
          traditional_value: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_value?: number
          data_type?: Database["public"]["Enums"]["portfolio_data_type"]
          date?: string
          id?: string
          initial_value?: number
          sp500_value?: number
          traditional_value?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          created_at: string
          id: string
          name: string
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          target_return: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          target_return?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          target_return?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_violation_logs: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          record_id: string | null
          table_name: string
          user_id: string | null
          violation_type: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name: string
          user_id?: string | null
          violation_type: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name?: string
          user_id?: string | null
          violation_type?: string
        }
        Relationships: []
      }
      sys_util_csv_analysis: {
        Row: {
          analysis_result: Json | null
          analysis_status: string | null
          content_type: string | null
          created_at: string
          file_name: string
          file_path: string
          id: string
          original_file_id: string | null
          size: number | null
          updated_at: string
          version_notes: string | null
          version_type: string | null
        }
        Insert: {
          analysis_result?: Json | null
          analysis_status?: string | null
          content_type?: string | null
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          original_file_id?: string | null
          size?: number | null
          updated_at?: string
          version_notes?: string | null
          version_type?: string | null
        }
        Update: {
          analysis_result?: Json | null
          analysis_status?: string | null
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          original_file_id?: string | null
          size?: number | null
          updated_at?: string
          version_notes?: string | null
          version_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sys_util_csv_analysis_original_file_id_fkey"
            columns: ["original_file_id"]
            isOneToOne: false
            referencedRelation: "sys_util_csv_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      sys_util_data_patterns: {
        Row: {
          created_at: string
          description: string | null
          detection_rules: Json
          id: string
          pattern_name: string
          pattern_type: string
          transformation_template: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          detection_rules: Json
          id?: string
          pattern_name: string
          pattern_type: string
          transformation_template?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          detection_rules?: Json
          id?: string
          pattern_name?: string
          pattern_type?: string
          transformation_template?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      sys_util_recommendations: {
        Row: {
          confidence_score: number | null
          created_at: string
          csv_analysis_id: string | null
          id: string
          notes: string[] | null
          pattern_id: string | null
          suggested_schema: Json | null
          transformation_id: string | null
          updated_at: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          csv_analysis_id?: string | null
          id?: string
          notes?: string[] | null
          pattern_id?: string | null
          suggested_schema?: Json | null
          transformation_id?: string | null
          updated_at?: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          csv_analysis_id?: string | null
          id?: string
          notes?: string[] | null
          pattern_id?: string | null
          suggested_schema?: Json | null
          transformation_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sys_util_recommendations_csv_analysis_id_fkey"
            columns: ["csv_analysis_id"]
            isOneToOne: false
            referencedRelation: "sys_util_csv_analysis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sys_util_recommendations_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "sys_util_data_patterns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sys_util_recommendations_transformation_id_fkey"
            columns: ["transformation_id"]
            isOneToOne: false
            referencedRelation: "sys_util_transformations"
            referencedColumns: ["id"]
          },
        ]
      }
      sys_util_transformations: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          id: string
          name: string
          transformation_type: string
          updated_at: string
        }
        Insert: {
          config: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          transformation_type: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          transformation_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          is_accredited: boolean | null
          is_active: boolean
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          is_accredited?: boolean | null
          is_active?: boolean
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_accredited?: boolean | null
          is_active?: boolean
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      contacts_without_companies: {
        Row: {
          company: string | null
          contact_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_csv_import_table: {
        Args: {
          table_name: string
          create_table_sql: string
        }
        Returns: undefined
      }
      execute_sql: {
        Args: {
          sql_query: string
        }
        Returns: undefined
      }
      extract_company_name: {
        Args: {
          fund_name: string
        }
        Returns: string
      }
      get_table_info: {
        Args: {
          table_name: string
        }
        Returns: {
          column_name: string
          data_type: string
        }[]
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      safe_to_numeric: {
        Args: {
          v: string
        }
        Returns: number
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      app_role: "sys_admin" | "manager" | "investor"
      investment_type:
        | "real_estate"
        | "private_equity"
        | "hedge_fund"
        | "venture_capital"
      palette_category: "professional" | "modern" | "innovative" | "custom"
      portfolio_data_type: "historical" | "projected"
      risk_level: "low" | "medium" | "high"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
