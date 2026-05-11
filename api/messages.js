import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, relationship, content } = req.body;

    if (!name || !relationship || !content) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const { error } = await supabase.from("messages").insert([
      {
        name,
        relationship,
        content,
        date: new Date().toISOString()
      }
    ]);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ message: "Message posted" });
  }

  if (req.method === "GET") {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("date", { ascending: false });

    return res.status(200).json(data);
  }

  res.status(405).json({ error: "Method not allowed" });
}
