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
      alt_strategies: {
        Row: {
          collectibles_allocation: number | null
          commodities_allocation: number | null
          created_at: string
          cryptocurrencies_allocation: number | null
          hedge_funds_allocation: number | null
          id: string
          name: string
          private_credit_allocation: number | null
          private_debt_allocation: number | null
          private_equity_allocation: number | null
          real_estate_allocation: number | null
          strategy_type: Database["public"]["Enums"]["alt_strategy_type"]
          updated_at: string
        }
        Insert: {
          collectibles_allocation?: number | null
          commodities_allocation?: number | null
          created_at?: string
          cryptocurrencies_allocation?: number | null
          hedge_funds_allocation?: number | null
          id?: string
          name: string
          private_credit_allocation?: number | null
          private_debt_allocation?: number | null
          private_equity_allocation?: number | null
          real_estate_allocation?: number | null
          strategy_type: Database["public"]["Enums"]["alt_strategy_type"]
          updated_at?: string
        }
        Update: {
          collectibles_allocation?: number | null
          commodities_allocation?: number | null
          created_at?: string
          cryptocurrencies_allocation?: number | null
          hedge_funds_allocation?: number | null
          id?: string
          name?: string
          private_credit_allocation?: number | null
          private_debt_allocation?: number | null
          private_equity_allocation?: number | null
          real_estate_allocation?: number | null
          strategy_type?: Database["public"]["Enums"]["alt_strategy_type"]
          updated_at?: string
        }
        Relationships: []
      }
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
      csv_analysis: {
        Row: {
          analysis_result: Json | null
          analysis_status: string | null
          content_type: string | null
          created_at: string
          file_name: string
          file_path: string
          id: string
          size: number | null
          updated_at: string
        }
        Insert: {
          analysis_result?: Json | null
          analysis_status?: string | null
          content_type?: string | null
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          size?: number | null
          updated_at?: string
        }
        Update: {
          analysis_result?: Json | null
          analysis_status?: string | null
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          size?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      default_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      inflation_data: {
        Row: {
          category: string | null
          created_at: string
          date: string
          id: string
          inflation_rate: number
          notes: string | null
          region: string | null
          source: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          date: string
          id?: string
          inflation_rate: number
          notes?: string | null
          region?: string | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          date?: string
          id?: string
          inflation_rate?: number
          notes?: string | null
          region?: string | null
          source?: string | null
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
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          is_accredited: boolean | null
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          is_accredited?: boolean | null
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          is_accredited?: boolean | null
          last_name?: string | null
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
      alt_strategy_type:
        | "diversification"
        | "growth"
        | "income"
        | "preservation"
        | "custom"
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
