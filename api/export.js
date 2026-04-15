import { createClient } from '@supabase/supabase-js';
import { verifyAdmin } from './_auth';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data: rsvps } = await supabase
    .from('rsvps')
    .select('*')
    .order('submission_date', { ascending: false });

  const headers = ['Name','Attendance','Guests','Meal','Message','Date'];

  const rows = rsvps.map(r => [
    `"${r.guest_name}"`,
    `"${r.attendance}"`,
    r.guest_count,
    `"${r.meal_preference || ''}"`,
    `"${r.message || ''}"`,
    `"${new Date(r.submission_date).toLocaleDateString()}"`
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="rsvps.csv"');

  res.status(200).send(csv);
}