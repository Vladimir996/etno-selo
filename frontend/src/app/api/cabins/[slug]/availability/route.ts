const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const res = await fetch(`${API_URL}/cabins/${slug}/availability`, {
    cache: "no-store",
  });

  const body = await res.json();
  return Response.json(body, { status: res.status });
}
