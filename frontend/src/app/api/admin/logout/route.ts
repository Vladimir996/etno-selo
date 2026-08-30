export async function POST() {
  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", "admin_token=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0");
  return response;
}
