-- ============================================
-- SUPABASE SETUP FOR SHING & JAM WEDDING
-- ============================================

-- Create RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_name TEXT NOT NULL,
    attendance TEXT NOT NULL,
    guest_count INTEGER DEFAULT 1,
    meal_preference TEXT,
    message TEXT,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin (password will be hashed)
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', crypt('Simplengta0///', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
DROP POLICY IF EXISTS "Allow anonymous inserts to rsvps" ON rsvps;
CREATE POLICY "Allow anonymous inserts to rsvps" ON rsvps
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous inserts to messages" ON messages;
CREATE POLICY "Allow anonymous inserts to messages" ON messages
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated reads from rsvps" ON rsvps;
CREATE POLICY "Allow authenticated reads from rsvps" ON rsvps
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated reads from messages" ON messages;
CREATE POLICY "Allow authenticated reads from messages" ON messages
    FOR SELECT USING (auth.role() = 'authenticated');
