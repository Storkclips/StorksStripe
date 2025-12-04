# Supabase Setup Instructions

## ⚠️ IMPORTANT: Run This SQL First!

Before the app can work with Supabase, you need to create the database tables.

### Steps:

1. **Go to Supabase SQL Editor:**
   https://supabase.com/dashboard/project/mltnlgeazcinfbcvhcut/sql

2. **Run the following SQL:**

```sql
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_transactions_session_id ON payment_transactions(session_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment_status ON payment_transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_timestamp ON payment_transactions(timestamp DESC);

-- Insert default creator profile if not exists
INSERT INTO creator_profile (name, bio, avatar_url, social_links)
SELECT 'Your Creator Name', 'Support me with a tip!', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400', '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM creator_profile LIMIT 1);
```

3. **Click "Run" to execute the SQL**

4. **Verify the tables were created:**
   - Go to Table Editor in Supabase
   - You should see `creator_profile` and `payment_transactions` tables

5. **Restart the backend:**
   ```bash
   sudo supervisorctl restart backend
   ```

## What's Changed?

✅ **Secure Storage:**
- Stripe keys now in Supabase environment variables
- Supabase credentials stored in `.env` files
- No more hardcoded secrets

✅ **Better Database:**
- PostgreSQL (Supabase) instead of MongoDB
- Better performance and ACID compliance
- Real-time subscriptions available (optional)

✅ **Scalability:**
- Supabase handles connection pooling
- Built-in API generation
- Automatic backups

## Environment Variables

### Backend (.env):
```
SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co
SUPABASE_SERVICE_KEY=<your-service-key>
STRIPE_API_KEY=sk_test_Ydd9sndM4d0bMBBXxyoxNblV
CORS_ORIGINS=*
```

### Frontend (.env):
```
REACT_APP_BACKEND_URL=https://stripe-tips.preview.emergentagent.com
REACT_APP_SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<your-anon-key>
```

## Troubleshooting

**Tables not found?**
- Make sure you ran the SQL in Step 2
- Check Table Editor to verify tables exist

**Connection errors?**
- Verify your Supabase URL and keys in `.env`
- Restart backend: `sudo supervisorctl restart backend`

**Data migration?**
- Old MongoDB data needs manual migration
- Export from MongoDB and import to Supabase if needed
