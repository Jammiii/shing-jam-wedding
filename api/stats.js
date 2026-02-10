import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
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
        .select('*');

      if (rsvpsError) throw rsvpsError;

      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*');

      if (messagesError) throw messagesError;

      const totalGuests = rsvps.reduce((sum, rsvp) => sum + (parseInt(rsvp.guest_count) || 0), 0);
      const attending = rsvps.filter(r => r.attendance === 'Accepts with pleasure');
      const declining = rsvps.filter(r => r.attendance === 'Regretfully declines');

      const mealPreferences = {};
      attending.forEach(rsvp => {
        if (rsvp.meal_preference) {
          mealPreferences[rsvp.meal_preference] = (mealPreferences[rsvp.meal_preference] || 0) + 1;
        }
      });

      const stats = {
        total_responses: rsvps.length,
        total_guests: totalGuests,
        attending_count: attending.length,
        declining_count: declining.length,
        messages_count: messages.length,
        meal_preferences: mealPreferences,
        recent_rsvps: rsvps.slice(0, 10),
        recent_messages: messages.slice(0, 10)
      };

      res.status(200).json({ stats });

    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
