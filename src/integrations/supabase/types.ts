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
          is_deleted: boolean | null
          is_featured: boolean | null
          likes: number | null
          telegram_link: string | null
          time_until_listing: string | null
          title: string | null
          trade_link: string | null
          tuzemoon_until: string | null
          twitter_link: string | null
          updated_at: string | null
        }
        Insert: {
          blockchain?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: never
          image_url?: string | null
          is_deleted?: boolean | null
          is_featured?: boolean | null
          likes?: number | null
          telegram_link?: string | null
          time_until_listing?: string | null
          title?: string | null
          trade_link?: string | null
          tuzemoon_until?: string | null
          twitter_link?: string | null
          updated_at?: string | null
        }
        Update: {
          blockchain?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: never
          image_url?: string | null
          is_deleted?: boolean | null
          is_featured?: boolean | null
          likes?: number | null
          telegram_link?: string | null
          time_until_listing?: string | null
          title?: string | null
          trade_link?: string | null
          tuzemoon_until?: string | null
          twitter_link?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Sessions: {
        Row: {
          created_at: string
          id: number
          is_active: boolean | null
          last_seen_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          is_active?: boolean | null
          last_seen_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          is_active?: boolean | null
          last_seen_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      TransactionLogs: {
        Row: {
          amount: number | null
          created_at: string | null
          error_message: string | null
          id: number
          meme_id: number | null
          meme_metadata: Json | null
          transaction_signature: string | null
          transaction_status: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: number
          meme_id?: number | null
          meme_metadata?: Json | null
          transaction_signature?: string | null
          transaction_status: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: number
          meme_id?: number | null
          meme_metadata?: Json | null
          transaction_signature?: string | null
          transaction_status?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "TransactionLogs_meme_id_fkey"
            columns: ["meme_id"]
            isOneToOne: false
            referencedRelation: "Memes"
            referencedColumns: ["id"]
          },
        ]
      }
      TuzemoonPayments: {
        Row: {
          amount: number
          created_at: string
          id: number
          meme_id: number | null
          meme_metadata: Json | null
          transaction_signature: string | null
          transaction_status: string | null
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: never
          meme_id?: number | null
          meme_metadata?: Json | null
          transaction_signature?: string | null
          transaction_status?: string | null
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: never
          meme_id?: number | null
          meme_metadata?: Json | null
          transaction_signature?: string | null
          transaction_status?: string | null
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "TuzemoonPayments_meme_id_fkey"
            columns: ["meme_id"]
            isOneToOne: false
            referencedRelation: "Memes"
            referencedColumns: ["id"]
          },
        ]
      }
      Users: {
        Row: {
          auth_id: string | null
          created_at: string
          email: string | null
          id: number
          is_admin: boolean | null
          is_verified: boolean | null
          name: string | null
          profile_image: string | null
          wallet_address: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string
          email?: string | null
          id?: number
          is_admin?: boolean | null
          is_verified?: boolean | null
          name?: string | null
          profile_image?: string | null
          wallet_address?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string
          email?: string | null
          id?: number
          is_admin?: boolean | null
          is_verified?: boolean | null
          name?: string | null
          profile_image?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      WalletNonces: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: number
          is_used: boolean | null
          nonce: string
          wallet_address: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: number
          is_used?: boolean | null
          nonce: string
          wallet_address: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: number
          is_used?: boolean | null
          nonce?: string
          wallet_address?: string
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
      bytea_to_text: {
        Args: {
          data: string
        }
        Returns: string
      }
      check_if_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      check_tuzemoon_expiry: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      http: {
        Args: {
          request: Database["public"]["CompositeTypes"]["http_request"]
        }
        Returns: unknown
      }
      http_delete:
        | {
            Args: {
              uri: string
            }
            Returns: unknown
          }
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: unknown
          }
      http_get:
        | {
            Args: {
              uri: string
            }
            Returns: unknown
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: unknown
          }
      http_head: {
        Args: {
          uri: string
        }
        Returns: unknown
      }
      http_header: {
        Args: {
          field: string
          value: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: unknown
      }
      http_post:
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: unknown
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: unknown
          }
      http_put: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: unknown
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: {
          curlopt: string
          value: string
        }
        Returns: boolean
      }
      text_to_bytea: {
        Args: {
          data: string
        }
        Returns: string
      }
      urlencode:
        | {
            Args: {
              data: Json
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
      verify_admin_key: {
        Args: {
          input_key: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
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
