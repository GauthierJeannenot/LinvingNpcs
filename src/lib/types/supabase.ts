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
      Game: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      game_npc: {
        Row: {
          created_at: string
          gameId: number
          id: number
          npcId: number
        }
        Insert: {
          created_at?: string
          gameId?: number
          id?: number
          npcId?: number
        }
        Update: {
          created_at?: string
          gameId?: number
          id?: number
          npcId?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_npc_gameId_fkey"
            columns: ["gameId"]
            isOneToOne: false
            referencedRelation: "Game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_npc_npcId_fkey"
            columns: ["npcId"]
            isOneToOne: false
            referencedRelation: "Npc"
            referencedColumns: ["id"]
          },
        ]
      }
      Npc: {
        Row: {
          created_at: string
          id: number
          lastName: string
          name: string
          personae: string
          picture: string
          voiceName: string
          voicePitch: string
          voiceRate: string
          voiceStyle: string
        }
        Insert: {
          created_at?: string
          id?: number
          lastName?: string
          name?: string
          personae?: string
          picture?: string
          voiceName?: string
          voicePitch?: string
          voiceRate?: string
          voiceStyle?: string
        }
        Update: {
          created_at?: string
          id?: number
          lastName?: string
          name?: string
          personae?: string
          picture?: string
          voiceName?: string
          voicePitch?: string
          voiceRate?: string
          voiceStyle?: string
        }
        Relationships: []
      }
      relatedNpc: {
        Row: {
          npcId: number
          relatedNpcID: number
        }
        Insert: {
          npcId: number
          relatedNpcID: number
        }
        Update: {
          npcId?: number
          relatedNpcID?: number
        }
        Relationships: [
          {
            foreignKeyName: "relatedNpc_npcId_fkey"
            columns: ["npcId"]
            isOneToOne: false
            referencedRelation: "Npc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatedNpc_relatedNpcID_fkey"
            columns: ["relatedNpcID"]
            isOneToOne: false
            referencedRelation: "Npc"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          created_at: string
          email: string
          id: number
        }
        Insert: {
          created_at?: string
          email?: string
          id?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
        }
        Relationships: []
      }
      user_game: {
        Row: {
          created_at: string
          gameId: number | null
          id: number
          userId: number | null
        }
        Insert: {
          created_at?: string
          gameId?: number | null
          id?: number
          userId?: number | null
        }
        Update: {
          created_at?: string
          gameId?: number | null
          id?: number
          userId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_game_gameId_fkey"
            columns: ["gameId"]
            isOneToOne: false
            referencedRelation: "Game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_game_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
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