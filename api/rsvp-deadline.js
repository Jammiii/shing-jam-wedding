export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const deadline = new Date("2027-03-01T23:59:59Z");
  const now = new Date();

  res.status(200).json({
    passed: now > deadline,
    deadline
  });
}