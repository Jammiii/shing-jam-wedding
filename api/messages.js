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
      const { name, content } = req.body;

      if (!name || !content) {
        return res.status(400).json({
          error: 'Name and message are required'
        });
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          name,
          content,
          date: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({
        message: 'Message posted successfully!',
        id: data[0].id
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
