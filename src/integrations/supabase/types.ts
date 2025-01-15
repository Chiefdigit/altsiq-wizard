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
      hf_performance: {
        Row: {
          apr_24: number | null
          aug_24: number | null
          created_at: string
          dec_24: string | null
          feb_24: number | null
          fund_name: string | null
          id: string
          imported_at: string
          jan_24: number | null
          jul_24: number | null
          jun_24: number | null
          mar_24: number | null
          may_24: number | null
          nov_24: number | null
          oct_24: number | null
          sep_24: number | null
          updated_at: string
          ytd_2024: number | null
        }
        Insert: {
          apr_24?: number | null
          aug_24?: number | null
          created_at?: string
          dec_24?: string | null
          feb_24?: number | null
          fund_name?: string | null
          id?: string
          imported_at?: string
          jan_24?: number | null
          jul_24?: number | null
          jun_24?: number | null
          mar_24?: number | null
          may_24?: number | null
          nov_24?: number | null
          oct_24?: number | null
          sep_24?: number | null
          updated_at?: string
          ytd_2024?: number | null
        }
        Update: {
          apr_24?: number | null
          aug_24?: number | null
          created_at?: string
          dec_24?: string | null
          feb_24?: number | null
          fund_name?: string | null
          id?: string
          imported_at?: string
          jan_24?: number | null
          jul_24?: number | null
          jun_24?: number | null
          mar_24?: number | null
          may_24?: number | null
          nov_24?: number | null
          oct_24?: number | null
          sep_24?: number | null
          updated_at?: string
          ytd_2024?: number | null
        }
        Relationships: []
      }
      inflation_rates: {
        Row: {
          country_code: string
          country_name: string
          created_at: string
          id: string
          imported_at: string
          updated_at: string
          year_1960: number
          year_1961: number
          year_1962: number
          year_1963: number
          year_1964: number
          year_1965: number
          year_1966: number
          year_1967: number
          year_1968: number
          year_1969: number
          year_1970: number
          year_1971: number
          year_1972: number
          year_1973: number
          year_1974: number
          year_1975: number
          year_1976: number
          year_1977: number
          year_1978: number
          year_1979: number
          year_1980: number
          year_1981: number
          year_1982: number
          year_1983: number
          year_1984: number
          year_1985: number
          year_1986: number
          year_1987: number
          year_1988: number
          year_1989: number
          year_1990: number
          year_1991: number
          year_1992: number
          year_1993: number
          year_1994: number
          year_1995: number
          year_1996: number
          year_1997: number
          year_1998: number
          year_1999: number
          year_2000: number
          year_2001: number
          year_2002: number
          year_2003: number
          year_2004: number
          year_2005: number
          year_2006: number
          year_2007: number
          year_2008: number
          year_2009: number
          year_2010: number
          year_2011: number
          year_2012: number
          year_2013: number
          year_2014: number
          year_2015: number
          year_2016: number
          year_2017: number
          year_2018: number
          year_2019: number
          year_2020: number
          year_2021: number
          year_2022: number
          year_2023: number
          year_2024: number
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string
          id?: string
          imported_at?: string
          updated_at?: string
          year_1960: number
          year_1961: number
          year_1962: number
          year_1963: number
          year_1964: number
          year_1965: number
          year_1966: number
          year_1967: number
          year_1968: number
          year_1969: number
          year_1970: number
          year_1971: number
          year_1972: number
          year_1973: number
          year_1974: number
          year_1975: number
          year_1976: number
          year_1977: number
          year_1978: number
          year_1979: number
          year_1980: number
          year_1981: number
          year_1982: number
          year_1983: number
          year_1984: number
          year_1985: number
          year_1986: number
          year_1987: number
          year_1988: number
          year_1989: number
          year_1990: number
          year_1991: number
          year_1992: number
          year_1993: number
          year_1994: number
          year_1995: number
          year_1996: number
          year_1997: number
          year_1998: number
          year_1999: number
          year_2000: number
          year_2001: number
          year_2002: number
          year_2003: number
          year_2004: number
          year_2005: number
          year_2006: number
          year_2007: number
          year_2008: number
          year_2009: number
          year_2010: number
          year_2011: number
          year_2012: number
          year_2013: number
          year_2014: number
          year_2015: number
          year_2016: number
          year_2017: number
          year_2018: number
          year_2019: number
          year_2020: number
          year_2021: number
          year_2022: number
          year_2023: number
          year_2024: number
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string
          id?: string
          imported_at?: string
          updated_at?: string
          year_1960?: number
          year_1961?: number
          year_1962?: number
          year_1963?: number
          year_1964?: number
          year_1965?: number
          year_1966?: number
          year_1967?: number
          year_1968?: number
          year_1969?: number
          year_1970?: number
          year_1971?: number
          year_1972?: number
          year_1973?: number
          year_1974?: number
          year_1975?: number
          year_1976?: number
          year_1977?: number
          year_1978?: number
          year_1979?: number
          year_1980?: number
          year_1981?: number
          year_1982?: number
          year_1983?: number
          year_1984?: number
          year_1985?: number
          year_1986?: number
          year_1987?: number
          year_1988?: number
          year_1989?: number
          year_1990?: number
          year_1991?: number
          year_1992?: number
          year_1993?: number
          year_1994?: number
          year_1995?: number
          year_1996?: number
          year_1997?: number
          year_1998?: number
          year_1999?: number
          year_2000?: number
          year_2001?: number
          year_2002?: number
          year_2003?: number
          year_2004?: number
          year_2005?: number
          year_2006?: number
          year_2007?: number
          year_2008?: number
          year_2009?: number
          year_2010?: number
          year_2011?: number
          year_2012?: number
          year_2013?: number
          year_2014?: number
          year_2015?: number
          year_2016?: number
          year_2017?: number
          year_2018?: number
          year_2019?: number
          year_2020?: number
          year_2021?: number
          year_2022?: number
          year_2023?: number
          year_2024?: number
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
