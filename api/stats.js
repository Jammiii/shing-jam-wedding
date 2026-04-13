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

  if (req.method === 'GET') {
    try {
      const { data: rsvps, error: rsvpsError } = await supabase
        .from('rsvps')
        .select('*')
        .order('submission_date', { ascending: false });

      if (rsvpsError) throw rsvpsError;

      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('date', { ascending: false });

      if (messagesError) throw messagesError;

      const totalGuests = (rsvps || []).reduce((sum, rsvp) => sum + (parseInt(rsvp.guest_count) || 0), 0);
      const attending = (rsvps || []).filter(r => r.attendance === 'Accepts with pleasure');
      const declining = (rsvps || []).filter(r => r.attendance === 'Regretfully declines');

      const stats = {
        total_responses: rsvps?.length || 0,
        total_guests: totalGuests,
        attending_count: attending.length,
        declining_count: declining.length,
        messages_count: messages?.length || 0,
        recent_rsvps: rsvps?.slice(0, 10) || [],
        recent_messages: messages?.slice(0, 10) || []
      };

      res.status(200).json({ stats });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
