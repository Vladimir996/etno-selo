const pool = require("../db");
const { logActivity } = require("../lib/logger");
const { findCabinBySlug } = require("./cabinsController");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const STATUSES = ["na_cekanju", "potvrdjena", "odbijena", "otkazana"];

async function listBookings(req, res) {
  const [rows] = await pool.query(
    `SELECT b.id, c.slug AS cabin, b.guest_name, b.email, b.phone, b.check_in, b.check_out,
            b.guests_count, b.note, b.status, b.created_at
     FROM bookings b
     JOIN cabins c ON c.id = b.cabin_id
     ORDER BY b.created_at DESC`,
  );
  res.json(rows);
}

async function createBooking(req, res) {
  const { ime, email, telefon, brvnara, datumDolaska, datumOdlaska, brojGostiju, napomena } =
    req.body ?? {};

  const missing = [];
  if (!ime) missing.push("ime");
  if (!email) missing.push("email");
  if (!telefon) missing.push("telefon");
  if (!brvnara) missing.push("brvnara");
  if (!datumDolaska) missing.push("datumDolaska");
  if (!datumOdlaska) missing.push("datumOdlaska");
  if (!brojGostiju) missing.push("brojGostiju");
  if (missing.length > 0) {
    return res.status(400).json({ error: `Nedostaju polja: ${missing.join(", ")}` });
  }

  if (!DATE_RE.test(datumDolaska) || !DATE_RE.test(datumOdlaska)) {
    return res.status(400).json({ error: "Neispravan format datuma." });
  }
  if (datumOdlaska <= datumDolaska) {
    return res.status(400).json({ error: "Datum odlaska mora biti posle datuma dolaska." });
  }

  const cabin = await findCabinBySlug(brvnara);
  if (!cabin) return res.status(404).json({ error: "Izabrana brvnara ne postoji." });

  const hasOverlap = await rangeOverlapsUnavailable(cabin.id, datumDolaska, datumOdlaska);
  if (hasOverlap) {
    await logActivity({
      action: "booking.rejected_overlap",
      entityType: "cabin",
      entityId: cabin.id,
      payload: { brvnara, datumDolaska, datumOdlaska },
      req,
    });
    return res.status(409).json({ error: "Izabrani termin više nije slobodan za ovu brvnaru." });
  }

  const [result] = await pool.query(
    `INSERT INTO bookings (cabin_id, guest_name, email, phone, check_in, check_out, guests_count, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [cabin.id, ime, email, telefon, datumDolaska, datumOdlaska, brojGostiju, napomena || null],
  );

  await logActivity({
    action: "booking.created",
    entityType: "booking",
    entityId: result.insertId,
    payload: { brvnara, datumDolaska, datumOdlaska, brojGostiju },
    req,
  });

  res.status(201).json({ ok: true, id: result.insertId, status: "na_cekanju" });
}

async function updateBookingStatus(req, res) {
  const id = Number(req.params.id);
  const { status } = req.body ?? {};

  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status mora biti jedan od: ${STATUSES.join(", ")}` });
  }

  const [existingRows] = await pool.query("SELECT id, status FROM bookings WHERE id = ?", [id]);
  const existing = existingRows[0];
  if (!existing) return res.status(404).json({ error: "Rezervacija nije pronađena." });

  await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);

  await logActivity({
    action: "booking.status_updated",
    entityType: "booking",
    entityId: id,
    payload: { from: existing.status, to: status, admin: req.admin?.username },
    req,
  });

  res.json({ ok: true, id, status });
}

async function rangeOverlapsUnavailable(cabinId, checkIn, checkOut) {
  const [bookingRows] = await pool.query(
    `SELECT 1 FROM bookings
     WHERE cabin_id = ? AND status IN ('na_cekanju', 'potvrdjena')
       AND check_in < ? AND check_out > ?
     LIMIT 1`,
    [cabinId, checkOut, checkIn],
  );
  if (bookingRows.length > 0) return true;

  const [blockedRows] = await pool.query(
    `SELECT 1 FROM unavailable_periods
     WHERE cabin_id = ? AND start_date < ? AND end_date > ?
     LIMIT 1`,
    [cabinId, checkOut, checkIn],
  );
  return blockedRows.length > 0;
}

module.exports = { listBookings, createBooking, updateBookingStatus };
