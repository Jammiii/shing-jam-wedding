import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "./_auth";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// A submitted RSVP represents one guest when guest_count is absent.
// Continue honoring a valid positive guest_count for future group RSVPs.
function countGuests(rsvp) {
  const count = Number(rsvp.guest_count);
  return Number.isSafeInteger(count) && count > 0 ? count : 1;
}

function monthlyActivity(rsvps) {
  const validDates = rsvps
    .map(rsvp => new Date(rsvp.submission_date))
    .filter(date => !Number.isNaN(date.getTime()));

  // Show the last eight months of the submission history. This also works
  // for older weddings, when no fresh RSVPs were received this month.
  const last = validDates.length
    ? new Date(Math.max(...validDates.map(date => date.getTime())))
    : new Date();
  const lastMonth = new Date(Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), 1));
  const counts = new Map();
  for (const date of validDates) {
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const monthly_rsvps = Array.from({ length: 8 }, (_, i) => {
    const date = new Date(Date.UTC(lastMonth.getUTCFullYear(), lastMonth.getUTCMonth() - 7 + i, 1));
    return {
      label: date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
      count: counts.get(`${date.getUTCFullYear()}-${date.getUTCMonth()}`) || 0
    };
  });
  return {
    monthly_rsvps,
    trend_description: `Monthly submissions through ${lastMonth.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}`
  };
}

export default async function handler(req, res) {
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const [{ data: rsvps, error: rsvpError }, { data: messages, error: messageError }] = await Promise.all([
      supabase.from("rsvps").select("*"),
      supabase.from("messages").select("*")
    ]);
    if (rsvpError) throw rsvpError;
    if (messageError) throw messageError;

    const entries = rsvps || [];
    const attending = entries.filter(r => r.attendance === "Accepts with pleasure");
    const declining = entries.filter(r => r.attendance === "Regretfully declines");
    const mealCounts = new Map();
    for (const rsvp of attending) {
      const meal = typeof rsvp.meal_preference === "string" && rsvp.meal_preference.trim()
        ? rsvp.meal_preference.trim()
        : "Not specified";
      mealCounts.set(meal, (mealCounts.get(meal) || 0) + 1);
    }
    const meal_preferences = [...mealCounts]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    const ordered = [...entries].sort((a, b) => {
      const aTime = new Date(a.submission_date).getTime() || 0;
      const bTime = new Date(b.submission_date).getTime() || 0;
      return bTime - aTime;
    });

    return res.status(200).json({
      stats: {
        total_responses: entries.length,
        total_guests: entries.reduce((sum, r) => sum + countGuests(r), 0),
        attending_count: attending.length,
        declining_count: declining.length,
        messages_count: (messages || []).length,
        all_rsvps: ordered,
        recent_rsvps: ordered.slice(0, 10),
        meal_preferences,
        ...monthlyActivity(entries)
      }
    });
  } catch (error) {
    console.error("RSVP dashboard stats error:", error);
    return res.status(500).json({ error: "Unable to load dashboard statistics." });
  }
}
