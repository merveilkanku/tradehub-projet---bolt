/*
  # TradeHub Database Schema

  1. New Tables
    - `profiles` - User profiles for both simple users and suppliers
    - `products` - Products posted by suppliers
    - `conversations` - Chat conversations between buyers and suppliers
    - `messages` - Individual messages within conversations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Suppliers can manage their products
    - Users can participate in conversations they're part of

  3. Performance
    - Add indexes for frequently queried columns
    - Optimize for location-based and category searches
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type text NOT NULL CHECK (user_type IN ('simple', 'supplier')),
  full_name text NOT NULL,
  avatar_url text,
  bio text,
  phone text NOT NULL,
  country text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  is_supplier_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  category text NOT NULL,
  images text[] DEFAULT '{}',
  country text NOT NULL,
  city text NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  supplier_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
  -- Drop profiles policies
  DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  DROP POLICY IF EXISTS "tradehub_profiles_read_all" ON profiles;
  DROP POLICY IF EXISTS "tradehub_profiles_update_own" ON profiles;
  DROP POLICY IF EXISTS "tradehub_profiles_insert_own" ON profiles;
  
  -- Drop products policies
  DROP POLICY IF EXISTS "Anyone can read available products" ON products;
  DROP POLICY IF EXISTS "Suppliers can insert their products" ON products;
  DROP POLICY IF EXISTS "Suppliers can update their products" ON products;
  DROP POLICY IF EXISTS "Suppliers can delete their products" ON products;
  DROP POLICY IF EXISTS "tradehub_products_read_available" ON products;
  DROP POLICY IF EXISTS "tradehub_products_insert_suppliers" ON products;
  DROP POLICY IF EXISTS "tradehub_products_update_own" ON products;
  DROP POLICY IF EXISTS "tradehub_products_delete_own" ON products;
  
  -- Drop conversations policies
  DROP POLICY IF EXISTS "Users can read their conversations" ON conversations;
  DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
  DROP POLICY IF EXISTS "tradehub_conversations_read_participants" ON conversations;
  DROP POLICY IF EXISTS "tradehub_conversations_insert_participants" ON conversations;
  
  -- Drop messages policies
  DROP POLICY IF EXISTS "Users can read messages from their conversations" ON messages;
  DROP POLICY IF EXISTS "Users can send messages to their conversations" ON messages;
  DROP POLICY IF EXISTS "tradehub_messages_read_conversation_participants" ON messages;
  DROP POLICY IF EXISTS "tradehub_messages_insert_conversation_participants" ON messages;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore errors if policies don't exist
    NULL;
END $$;

-- Profiles policies
CREATE POLICY "tradehub_profiles_read_all"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "tradehub_profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "tradehub_profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

-- Products policies
CREATE POLICY "tradehub_products_read_available"
  ON products FOR SELECT
  TO authenticated
  USING (is_available = true);

CREATE POLICY "tradehub_products_insert_suppliers"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid()::text = supplier_id::text AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'supplier')
  );

CREATE POLICY "tradehub_products_update_own"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = supplier_id::text);

CREATE POLICY "tradehub_products_delete_own"
  ON products FOR DELETE
  TO authenticated
  USING (auth.uid()::text = supplier_id::text);

-- Conversations policies
CREATE POLICY "tradehub_conversations_read_participants"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text = buyer_id::text OR 
    auth.uid()::text = supplier_id::text
  );

CREATE POLICY "tradehub_conversations_insert_participants"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid()::text = buyer_id::text OR 
    auth.uid()::text = supplier_id::text
  );

-- Messages policies
CREATE POLICY "tradehub_messages_read_conversation_participants"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = conversation_id AND 
      (buyer_id = auth.uid() OR supplier_id = auth.uid())
    )
  );

CREATE POLICY "tradehub_messages_insert_conversation_participants"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid()::text = sender_id::text AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = conversation_id AND 
      (buyer_id = auth.uid() OR supplier_id = auth.uid())
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tradehub_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_tradehub_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_tradehub_products_location ON products(country, city);
CREATE INDEX IF NOT EXISTS idx_tradehub_conversations_participants ON conversations(buyer_id, supplier_id);
CREATE INDEX IF NOT EXISTS idx_tradehub_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_tradehub_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_tradehub_profiles_location ON profiles(country, city);