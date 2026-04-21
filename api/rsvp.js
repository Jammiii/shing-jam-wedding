import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      guest_name,
      attendance,
      guest_count,
      meal_preference,
      message
    } = req.body;

    if (!guest_name || !attendance) {
      return res.status(400).json({
        success: false,
        error: "Guest name and attendance are required"
      });
    }

    const { data, error } = await supabase
      .from("rsvps")
      .insert([
        {
          guest_name,
          attendance,
          guest_count: Number(guest_count) || 0,
          meal_preference: meal_preference || null,
          message: message || null,
          submission_date: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    
    if (message) {
      await supabase.from("messages").insert([
        {
          name: guest_name,
          content: message,
          date: new Date().toISOString()
        }
      ]);
    }
    return res.status(200).json({
      success: true,
      message: "RSVP saved successfully",
      data: data[0]
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
