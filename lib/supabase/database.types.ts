export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "user" | "admin";
export type StudyMode = "focus" | "short" | "long";
export type TaskPriority = "low" | "normal" | "high";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          username: string | null;
          bio: string | null;
          avatar_url: string | null;
          cover_url: string | null;
          pronouns: string | null;
          study_field: string | null;
          school: string | null;
          year_level: string | null;
          city: string | null;
          time_zone: string | null;
          favorite_subjects: string | null;
          birthday: string | null;
          role: UserRole;
          is_suspended: boolean;
          created_at: string;
          updated_at: string;
          last_seen_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          username?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          cover_url?: string | null;
          pronouns?: string | null;
          study_field?: string | null;
          school?: string | null;
          year_level?: string | null;
          city?: string | null;
          time_zone?: string | null;
          favorite_subjects?: string | null;
          birthday?: string | null;
          role?: UserRole;
          is_suspended?: boolean;
          created_at?: string;
          updated_at?: string;
          last_seen_at?: string | null;
        };
        Update: {
          email?: string;
          display_name?: string | null;
          username?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          cover_url?: string | null;
          pronouns?: string | null;
          study_field?: string | null;
          school?: string | null;
          year_level?: string | null;
          city?: string | null;
          time_zone?: string | null;
          favorite_subjects?: string | null;
          birthday?: string | null;
          role?: UserRole;
          is_suspended?: boolean;
          updated_at?: string;
          last_seen_at?: string | null;
        };
      };
      user_settings: {
        Row: {
          user_id: string;
          focus_minutes: number;
          short_break_minutes: number;
          long_break_minutes: number;
          daily_goal_minutes: number;
          dark_mode: boolean;
          auto_cycle: boolean;
          ambient: string;
          chime: boolean;
          coins: number;
          lifetime_focus_minutes: number;
          equipped_sound: string | null;
          equipped_theme: string | null;
          equipped_accessory: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          focus_minutes?: number;
          short_break_minutes?: number;
          long_break_minutes?: number;
          daily_goal_minutes?: number;
          dark_mode?: boolean;
          auto_cycle?: boolean;
          ambient?: string;
          chime?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          focus_minutes?: number;
          short_break_minutes?: number;
          long_break_minutes?: number;
          daily_goal_minutes?: number;
          dark_mode?: boolean;
          auto_cycle?: boolean;
          ambient?: string;
          chime?: boolean;
          updated_at?: string;
        };
      };
      topics: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          position?: number;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          topic_id: string | null;
          text: string;
          done: boolean;
          priority: TaskPriority;
          due_date: string | null;
          notes: string | null;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic_id?: string | null;
          text: string;
          done?: boolean;
          priority?: TaskPriority;
          due_date?: string | null;
          notes?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          topic_id?: string | null;
          text?: string;
          done?: boolean;
          priority?: TaskPriority;
          due_date?: string | null;
          notes?: string | null;
          position?: number;
          updated_at?: string;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          topic_id: string | null;
          task_id: string | null;
          topic_name: string | null;
          task_name: string | null;
          minutes: number;
          mode: StudyMode;
          focus_score: number | null;
          studied_on: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic_id?: string | null;
          task_id?: string | null;
          topic_name?: string | null;
          task_name?: string | null;
          minutes: number;
          mode?: StudyMode;
          focus_score?: number | null;
          studied_on?: string;
          created_at?: string;
        };
        Update: {
          focus_score?: number | null;
        };
      };
      admin_audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          target_user_id: string | null;
          action: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          target_user_id?: string | null;
          action: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: never;
      };
      study_rooms: {
        Row: {
          id: string;
          code: string;
          owner_id: string;
          name: string;
          topic_id: string | null;
          focus_minutes: number;
          is_open: boolean;
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code?: string;
          owner_id: string;
          name: string;
          topic_id?: string | null;
          focus_minutes?: number;
          is_open?: boolean;
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          topic_id?: string | null;
          focus_minutes?: number;
          is_open?: boolean;
          started_at?: string | null;
          ended_at?: string | null;
          updated_at?: string;
        };
      };
      study_room_members: {
        Row: {
          room_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          room_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: never;
      };
      room_messages: {
        Row: {
          id: string;
          room_id: string;
          user_id: string | null;
          body: string;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id?: string | null;
          body: string;
          created_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          body?: string;
          deleted_at?: string | null;
        };
      };
      user_purchases: {
        Row: {
          user_id: string;
          item_id: string;
          price_paid: number;
          purchased_at: string;
        };
        Insert: {
          user_id: string;
          item_id: string;
          price_paid: number;
          purchased_at?: string;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: {
      join_room_by_code: {
        Args: { p_code: string };
        Returns: string;
      };
      award_focus_coins: {
        Args: { p_minutes: number; p_coins: number };
        Returns: void;
      };
      purchase_reward: {
        Args: { p_item_id: string; p_price: number };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      study_mode: StudyMode;
      task_priority: TaskPriority;
    };
    CompositeTypes: Record<string, never>;
  };
}
