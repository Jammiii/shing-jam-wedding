import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "./_auth";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data: rsvps } = await supabase.from("rsvps").select("*");
  const { data: messages } = await supabase.from("messages").select("*");

  const totalGuests = (rsvps || []).reduce(
    (sum, r) => sum + (parseInt(r.guest_count) || 0),
    0
  );

  res.status(200).json({
    stats: {
      total_responses: rsvps?.length || 0,
      total_guests: totalGuests,
      attending_count:
        rsvps?.filter(r => r.attendance === "Accepts with pleasure").length || 0,
      declining_count:
        rsvps?.filter(r => r.attendance === "Regretfully declines").length || 0,
      messages_count: messages?.length || 0,
      recent_rsvps: rsvps?.slice(-10).reverse()
    }
  });
}