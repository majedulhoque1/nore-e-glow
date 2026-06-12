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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json
          path: string | null
          product_id: string | null
          product_slug: string | null
          visitor_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          path?: string | null
          product_id?: string | null
          product_slug?: string | null
          visitor_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          path?: string | null
          product_id?: string | null
          product_slug?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          display_order: number | null
          id: string
          image_url: string | null
          name: string
          slug: string
        }
        Insert: {
          display_order?: number | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
        }
        Update: {
          display_order?: number | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      mystery_box_campaigns: {
        Row: {
          coupon_amount: number
          coupon_code: string
          coupon_expires_days: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
          status: string | null
        }
        Insert: {
          coupon_amount: number
          coupon_code: string
          coupon_expires_days?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          status?: string | null
        }
        Update: {
          coupon_amount?: number
          coupon_code?: string
          coupon_expires_days?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          status?: string | null
        }
        Relationships: []
      }
      mystery_box_inventory: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          id: string
          is_packed: boolean | null
          packed_into_order_id: string | null
          product_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          is_packed?: boolean | null
          packed_into_order_id?: string | null
          product_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          is_packed?: boolean | null
          packed_into_order_id?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mystery_box_inventory_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "mystery_box_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mystery_box_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      mystery_box_orders: {
        Row: {
          address: string
          box_quantity: number
          campaign_id: string | null
          client_ip: string | null
          coupon_code: string | null
          created_at: string | null
          extra_items: Json | null
          customer_name: string
          customer_phone: string
          delivered_at: string | null
          delivery_charge: number | null
          district: string
          gift_handwritten: boolean | null
          gift_message: string | null
          gift_recipient_name: string | null
          gift_wrap_cost: number | null
          gift_wrap_type: string | null
          id: string
          is_gift: boolean | null
          items_packed: Json | null
          order_number: string
          shipped_at: string | null
          status: string | null
          total: number
          tracking_number: string | null
          upazila: string
        }
        Insert: {
          address: string
          box_quantity?: number
          campaign_id?: string | null
          client_ip?: string | null
          coupon_code?: string | null
          created_at?: string | null
          extra_items?: Json | null
          customer_name: string
          customer_phone: string
          delivered_at?: string | null
          delivery_charge?: number | null
          district: string
          gift_handwritten?: boolean | null
          gift_message?: string | null
          gift_recipient_name?: string | null
          gift_wrap_cost?: number | null
          gift_wrap_type?: string | null
          id?: string
          is_gift?: boolean | null
          items_packed?: Json | null
          order_number: string
          shipped_at?: string | null
          status?: string | null
          total: number
          tracking_number?: string | null
          upazila: string
        }
        Update: {
          address?: string
          box_quantity?: number
          campaign_id?: string | null
          client_ip?: string | null
          coupon_code?: string | null
          created_at?: string | null
          extra_items?: Json | null
          customer_name?: string
          customer_phone?: string
          delivered_at?: string | null
          delivery_charge?: number | null
          district?: string
          gift_handwritten?: boolean | null
          gift_message?: string | null
          gift_recipient_name?: string | null
          gift_wrap_cost?: number | null
          gift_wrap_type?: string | null
          id?: string
          is_gift?: boolean | null
          items_packed?: Json | null
          order_number?: string
          shipped_at?: string | null
          status?: string | null
          total?: number
          tracking_number?: string | null
          upazila?: string
        }
        Relationships: [
          {
            foreignKeyName: "mystery_box_orders_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "mystery_box_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          created_at: string | null
          customer_name: string
          customer_phone: string
          delivery_charge: number
          district: string
          id: string
          items: Json
          note: string | null
          order_number: string
          status: string | null
          subtotal: number
          total: number
          upazila: string
        }
        Insert: {
          address: string
          created_at?: string | null
          customer_name: string
          customer_phone: string
          delivery_charge: number
          district: string
          id?: string
          items: Json
          note?: string | null
          order_number: string
          status?: string | null
          subtotal: number
          total: number
          upazila: string
        }
        Update: {
          address?: string
          created_at?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_charge?: number
          district?: string
          id?: string
          items?: Json
          note?: string | null
          order_number?: string
          status?: string | null
          subtotal?: number
          total?: number
          upazila?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          compare_at_price: number | null
          created_at: string | null
          description: string | null
          id: string
          images: string[]
          is_featured: boolean | null
          is_new_arrival: boolean | null
          name: string
          price: number
          slug: string
          stock_qty: number | null
        }
        Insert: {
          category: string
          compare_at_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[]
          is_featured?: boolean | null
          is_new_arrival?: boolean | null
          name: string
          price: number
          slug: string
          stock_qty?: number | null
        }
        Update: {
          category?: string
          compare_at_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[]
          is_featured?: boolean | null
          is_new_arrival?: boolean | null
          name?: string
          price?: number
          slug?: string
          stock_qty?: number | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_analytics_summary: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_top_products: {
        Args: {
          _event_type?: string
          _days?: number
          _limit?: number
        }
        Returns: {
          product_id: string | null
          product_slug: string | null
          product_name: string | null
          product_image: string | null
          event_count: number
        }[]
      }
      get_visitors_timeseries: {
        Args: {
          _days?: number
        }
        Returns: {
          day: string
          visitors: number
          pageviews: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      place_order: {
        Args: {
          p_items: Json
          p_customer_name: string
          p_customer_phone: string
          p_address: string
          p_district: string
          p_upazila: string
          p_note?: string | null
        }
        Returns: Json
      }
      place_mystery_order: {
        Args: {
          p_campaign_id: string | null
          p_custom_box_item_ids: string[] | null
          p_box_quantity: number
          p_is_gift: boolean
          p_gift_recipient_name: string | null
          p_gift_message: string | null
          p_gift_wrap_type: string
          p_gift_handwritten: boolean
          p_extra_items: Json | null
          p_customer_name: string
          p_customer_phone: string
          p_address: string
          p_district: string
          p_upazila: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    },
  },
} as const
