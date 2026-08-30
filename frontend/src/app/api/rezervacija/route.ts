const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

export type BookingRequestPayload = {
  ime: string;
  email: string;
  telefon: string;
  brvnara: string;
  datumDolaska: string;
  datumOdlaska: string;
  brojGostiju: number;
  napomena?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<BookingRequestPayload>;

  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.json();
  return Response.json(body, { status: res.status });
}
