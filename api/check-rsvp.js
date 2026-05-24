import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  const { name } = req.query;

  if (!name) {
    return res.status(400).json({
      success: false,
      results: []
    });
  }

  const { data, error } = await supabase
    .from("rsvps")
    .select("guest_name, attendance, meal_preference")
    .ilike("guest_name", `%${name}%`)
    .limit(5);

  if (error) {
    return res.status(500).json({
      success: false,
      results: []
    });
  }

  return res.status(200).json({
    success: true,
    results: data
  });
}