import { timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "./_auth";

// Require the admin password again for destructive actions. The existing
// verifyAdmin helper only checks token length, so it is not sufficient alone.
function validAdminPassword(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (typeof password !== "string" || !expected) return false;

  const receivedBytes = Buffer.from(password, "utf8");
  const expectedBytes = Buffer.from(expected, "utf8");
  return receivedBytes.length === expectedBytes.length &&
    timingSafeEqual(receivedBytes, expectedBytes);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  if (!verifyAdmin(req) || !validAdminPassword(req.body?.password)) {
    return res.status(401).json({ success: false, error: "Invalid admin session or password." });
  }

  const id = req.body?.id;
  const value = (typeof id === "string" || typeof id === "number") ? String(id).trim() : "";
  if (!value || value.length > 128 || !/^[a-zA-Z0-9_-]+$/.test(value)) {
    return res.status(400).json({ success: false, error: "Invalid RSVP ID." });
  }

  // Never expose the service role key in HTML or frontend JavaScript.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!process.env.SUPABASE_URL || !serviceRoleKey) {
    return res.status(503).json({
      success: false,
      error: "Deletion is not configured on the server."
    });
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await supabase
      .from("rsvps")
      .delete()
      .eq("id", value)
      .select("id");

    if (error) throw error;
    if (!data?.length) {
      return res.status(404).json({ success: false, error: "RSVP not found." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete RSVP API error:", error);
    return res.status(500).json({ success: false, error: "Unable to delete RSVP." });
  }
}
