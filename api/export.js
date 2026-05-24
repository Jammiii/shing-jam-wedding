import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "./_auth";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Format Manila Time
function formatDateTime(dateString) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleString("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
}

// Escape CSV values
function escapeCSV(value) {
  if (value === null || value === undefined || value === "") {
    return '"-"';
  }

  return `"${String(value).replace(/"/g, '""')}"`;
}

export default async function handler(req, res) {
  // Admin Protection
  if (!verifyAdmin(req)) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  try {
    // Fetch RSVPs
    const { data: rsvps, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("submission_date", { ascending: false });

    if (error) {
      throw error;
    }

    // CSV Headers
    const headers = [
      "Guest Name",
      "Attendance",
      "Meal Preference",
      "Message",
      "Date & Time"
    ];

    // CSV Rows
    const rows = rsvps.map(rsvp => [
      escapeCSV(rsvp.guest_name),
      escapeCSV(rsvp.attendance),
      escapeCSV(rsvp.meal_preference),
      escapeCSV(rsvp.message),
      escapeCSV(formatDateTime(rsvp.submission_date))
    ].join(","));

    // Final CSV
    const csv = [
      headers.join(","),
      ...rows
    ].join("\n");

    // Response Headers
    res.setHeader("Content-Type", "text/csv");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="rsvps.csv"`
    );

    return res.status(200).send(csv);

  } catch (error) {
    console.error("Export API Error:", error);

    return res.status(500).json({
      error: "Failed to export RSVP data"
    });
  }
}