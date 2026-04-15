export function verifyAdmin(req) {
  const auth = req.headers.authorization;

  if (!auth) return false;

  const token = auth.split(" ")[1];

  if (!token) return false;

  // simple validation (can upgrade later)
  return token.length > 10;
}