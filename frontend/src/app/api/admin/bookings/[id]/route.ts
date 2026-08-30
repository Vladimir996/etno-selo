import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return Response.json({ error: "Niste prijavljeni." }, { status: 401 });

  const payload = await request.json();

  const res = await fetch(`${API_URL}/bookings/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const body = await res.json();
  return Response.json(body, { status: res.status });
}
