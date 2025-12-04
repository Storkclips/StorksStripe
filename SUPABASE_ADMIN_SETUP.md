# Supabase Admin System Setup

## Step 1: Run This SQL in Supabase Dashboard

Go to: https://supabase.com/dashboard/project/mltnlgeazcinfbcvhcut/sql

```sql
-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create password_change_tokens table
CREATE TABLE IF NOT EXISTS password_change_tokens (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_password_change_tokens_token ON password_change_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_change_tokens_admin_id ON password_change_tokens(admin_id);

-- Insert default admin (password will be: Admin@123)
-- Hash for 'Admin@123': $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eFdCJzuNJ9py
INSERT INTO admin_users (email, hashed_password)
VALUES ('admin@tippingpage.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eFdCJzuNJ9py')
ON CONFLICT (email) DO NOTHING;
```

## Default Admin Credentials

**Email:** admin@tippingpage.com  
**Password:** Admin@123

⚠️ **IMPORTANT:** Change this password immediately after first login!

## Step 2: Add Resend API Key to Backend .env

Add this line to `/app/backend/.env`:

```
RESEND_API_KEY=re_2tskrrXi_MKmQ4F65r5ijGhGggyo5wtRK
```

## Step 3: Restart Backend

```bash
sudo supervisorctl restart backend
```

## Features

✅ **Secure Password Storage** - Passwords encrypted with bcrypt  
✅ **Email Verification** - Password changes require email confirmation  
✅ **Admin Panel** - Change password from dashboard  
✅ **Secure Tokens** - Time-limited verification tokens  
✅ **Session Management** - Automatic logout on security changes
