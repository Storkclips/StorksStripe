"""
Setup Supabase tables for the tipping application
Run this once to create the necessary tables
"""
import asyncio
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_SERVICE_KEY']

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def setup_tables():
    """Create tables in Supabase"""
    
    print("🚀 Setting up Supabase tables...")
    
    # Note: Tables should be created via Supabase SQL Editor
    # Here's the SQL to run in Supabase Dashboard → SQL Editor:
    
    sql_commands = """
    -- Create creator_profile table
    CREATE TABLE IF NOT EXISTS creator_profile (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL DEFAULT 'Your Creator Name',
        bio TEXT NOT NULL DEFAULT 'Support me with a tip!',
        avatar_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
        social_links JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create payment_transactions table
    CREATE TABLE IF NOT EXISTS payment_transactions (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL UNIQUE,
        amount DECIMAL(10,2) NOT NULL,
        currency TEXT NOT NULL DEFAULT 'usd',
        message TEXT,
        tipper_name TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_status TEXT NOT NULL DEFAULT 'pending',
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_payment_transactions_session_id ON payment_transactions(session_id);
    CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment_status ON payment_transactions(payment_status);
    CREATE INDEX IF NOT EXISTS idx_payment_transactions_timestamp ON payment_transactions(timestamp DESC);

    -- Insert default creator profile if not exists
    INSERT INTO creator_profile (name, bio, avatar_url, social_links)
    SELECT 'Your Creator Name', 'Support me with a tip!', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400', '{}'::jsonb
    WHERE NOT EXISTS (SELECT 1 FROM creator_profile LIMIT 1);
    """
    
    print("\n📋 Run the following SQL in your Supabase Dashboard:")
    print("   Go to: https://supabase.com/dashboard/project/mltnlgeazcinfbcvhcut/sql")
    print("\n" + "="*70)
    print(sql_commands)
    print("="*70 + "\n")
    
    # Test connection
    try:
        response = supabase.table('creator_profile').select("*").limit(1).execute()
        print("✅ Successfully connected to Supabase!")
        if response.data:
            print(f"✅ Found {len(response.data)} creator profile(s)")
        else:
            print("⚠️  No creator profiles found - please run the SQL above")
    except Exception as e:
        print(f"⚠️  Please run the SQL commands above in Supabase Dashboard")
        print(f"   Error: {str(e)}")

if __name__ == "__main__":
    setup_tables()
