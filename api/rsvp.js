import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Set CORS headers
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
      const { guest_name, attendance, guest_count, meal_preference, message } = req.body;

      if (!guest_name || !attendance) {
        return res.status(400).json({ 
          error: 'Name and attendance are required' 
        });
      }

      const { data, error } = await supabase
        .from('rsvps')
        .insert([{
          guest_name,
          attendance,
          guest_count: attendance === 'Accepts with pleasure' ? guest_count : 0,
          meal_preference: attendance === 'Accepts with pleasure' ? meal_preference : null,
          message: message || null
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ 
        message: 'RSVP submitted successfully!',
        id: data[0].id 
      });

    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
