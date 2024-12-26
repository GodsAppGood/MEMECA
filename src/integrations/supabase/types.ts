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
      Likes: {
        Row: {
          created_at: string
          id: number
          meme_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          meme_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          meme_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Likes_meme_id_fkey"
            columns: ["meme_id"]
            isOneToOne: false
            referencedRelation: "Memes"
            referencedColumns: ["id"]
          },
        ]
      }
      Memes: {
        Row: {
          blockchain: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          image_url: string | null
          is_featured: boolean | null
          likes: number | null
          telegram_link: string | null
          time_until_listing: string | null
          title: string
          trade_link: string | null
          tuzemoon_until: string | null
          twitter_link: string | null
        }
        Insert: {
          blockchain?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: never
          image_url?: string | null
          is_featured?: boolean | null
          likes?: number | null
          telegram_link?: string | null
          time_until_listing?: string | null
          title: string
          trade_link?: string | null
          tuzemoon_until?: string | null
          twitter_link?: string | null
        }
        Update: {
          blockchain?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: never
          image_url?: string | null
          is_featured?: boolean | null
          likes?: number | null
          telegram_link?: string | null
          time_until_listing?: string | null
          title?: string
          trade_link?: string | null
          tuzemoon_until?: string | null
          twitter_link?: string | null
        }
        Relationships: []
      }
      Users: {
        Row: {
          auth_id: string | null
          created_at: string
          email: string | null
          id: number
          is_admin: boolean | null
          name: string | null
          profile_image: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string
          email?: string | null
          id?: number
          is_admin?: boolean | null
          name?: string | null
          profile_image?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string
          email?: string | null
          id?: number
          is_admin?: boolean | null
          name?: string | null
          profile_image?: string | null
        }
        Relationships: []
      }
      Watchlist: {
        Row: {
          created_at: string
          id: number
          meme_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          meme_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          meme_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Watchlist_meme_id_fkey"
            columns: ["meme_id"]
            isOneToOne: false
            referencedRelation: "Memes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_tuzemoon_expiry: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      verify_admin_key: {
        Args: {
          key_to_verify: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
