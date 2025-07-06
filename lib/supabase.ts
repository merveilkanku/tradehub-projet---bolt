import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://mgsbxvttetlpcrvdfsed.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nc2J4dnR0ZXRscGNydmRmc2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjQwODIsImV4cCI6MjA2NTM0MDA4Mn0.TN8BlSXWlMnLKhXrpjyal1ncT7Lr_lnVgv5tpwmXEwQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_type: 'simple' | 'supplier';
          full_name: string;
          avatar_url?: string;
          bio?: string;
          phone: string;
          country: string;
          city: string;
          address: string;
          is_supplier_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_type: 'simple' | 'supplier';
          full_name: string;
          avatar_url?: string;
          bio?: string;
          phone: string;
          country: string;
          city: string;
          address: string;
          is_supplier_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_type?: 'simple' | 'supplier';
          full_name?: string;
          avatar_url?: string;
          bio?: string;
          phone?: string;
          country?: string;
          city?: string;
          address?: string;
          is_supplier_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          supplier_id: string;
          title: string;
          description: string;
          price: number;
          currency: string;
          category: string;
          images: string[];
          country: string;
          city: string;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          title: string;
          description: string;
          price: number;
          currency?: string;
          category: string;
          images?: string[];
          country: string;
          city: string;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          title?: string;
          description?: string;
          price?: number;
          currency?: string;
          category?: string;
          images?: string[];
          country?: string;
          city?: string;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          buyer_id: string;
          supplier_id: string;
          product_id?: string;
          last_message?: string;
          last_message_at?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          supplier_id: string;
          product_id?: string;
          last_message?: string;
          last_message_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          supplier_id?: string;
          product_id?: string;
          last_message?: string;
          last_message_at?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          created_at?: string;
        };
      };
    };
  };
};