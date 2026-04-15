import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://vtopssdggoyrckidbwma.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0b3Bzc2RnZ295cmNraWRid21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjY1MTYsImV4cCI6MjA4NjI0MjUxNn0.6pfBdshODoku9wZctD8TajsjLqVph-Qe5S2PHvWHI10';

const supabase = createClient(supabaseUrl, supabaseKey);

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
      const data = req.body;

      if (!data.guest_name || !data.attendance) {
        return res.status(400).json({
          success: false,
          error: 'Guest name and attendance are required'
        });
      }

      const rsvpData = {
        guest_name: data.guest_name,
        attendance: data.attendance,
        guest_count: data.guest_count || 0,
        meal_preference: data.meal_preference || null,
        message: data.message || null,
        submission_date: new Date().toISOString()
      };

      const { data: result, error } = await supabase
        .from('rsvps')
        .insert([rsvpData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      res.status(200).json({
        success: true,
        message: 'RSVP saved successfully!',
        data: result[0]
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}