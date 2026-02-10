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
      const { data: rsvps, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('submission_date', { ascending: false });

      if (error) throw error;

      const headers = ['Name', 'Attendance', 'Guests', 'Meal Preference', 'Message', 'Date'];
      const csvRows = [
        headers.join(','),
        ...rsvps.map(rsvp => [
          `"${(rsvp.guest_name || '').replace(/"/g, '""')}"`,
          `"${rsvp.attendance}"`,
          rsvp.guest_count || 0,
          `"${(rsvp.meal_preference || '').replace(/"/g, '""')}"`,
          `"${(rsvp.message || '').replace(/"/g, '""')}"`,
          `"${new Date(rsvp.submission_date).toLocaleDateString()}"`
        ].join(','))
      ];

      const csvContent = csvRows.join('
');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="wedding-rsvps.csv"');
      res.status(200).send(csvContent);

    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
