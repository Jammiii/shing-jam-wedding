import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Simplengta0///';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;

      if (username === 'admin' && password === ADMIN_PASSWORD) {
        const token = Buffer.from(`admin:${Date.now()}:${Math.random()}`).toString('base64');

        res.status(200).json({ 
          success: true, 
          token,
          username: 'admin',
          message: 'Login successful' 
        });
      } else {
        res.status(401).json({ 
          success: false, 
          error: 'Invalid credentials' 
        });
      }

    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
