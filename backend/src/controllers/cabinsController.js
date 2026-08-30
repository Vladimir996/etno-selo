const pool = require("../db");

async function listCabins(req, res) {
  const [cabins] = await pool.query("SELECT * FROM cabins ORDER BY id");
  res.json(cabins.map(serializeCabin));
}

async function getCabin(req, res) {
  const cabin = await findCabinBySlug(req.params.slug);
  if (!cabin) return res.status(404).json({ error: "Brvnara nije pronađena." });

  const [images] = await pool.query(
    "SELECT url, alt, category FROM cabin_images WHERE cabin_id = ? ORDER BY sort_order",
    [cabin.id],
  );
  const [amenities] = await pool.query(
    `SELECT a.name FROM amenities a
     JOIN cabin_amenities ca ON ca.amenity_id = a.id
     WHERE ca.cabin_id = ?`,
    [cabin.id],
  );

  res.json({
    ...serializeCabin(cabin),
    images,
    amenities: amenities.map((a) => a.name),
  });
}

async function getAvailability(req, res) {
  const cabin = await findCabinBySlug(req.params.slug);
  if (!cabin) return res.status(404).json({ error: "Brvnara nije pronađena." });

  const [bookingRanges] = await pool.query(
    `SELECT check_in AS start, check_out AS end FROM bookings
     WHERE cabin_id = ? AND status IN ('na_cekanju', 'potvrdjena')`,
    [cabin.id],
  );
  const [blockedRanges] = await pool.query(
    "SELECT start_date AS start, end_date AS end FROM unavailable_periods WHERE cabin_id = ?",
    [cabin.id],
  );

  res.json([...bookingRanges, ...blockedRanges]);
}

async function findCabinBySlug(slug) {
  const [rows] = await pool.query("SELECT * FROM cabins WHERE slug = ?", [slug]);
  return rows[0] ?? null;
}

function serializeCabin(cabin) {
  return {
    slug: cabin.slug,
    name: cabin.name,
    shortDescription: cabin.short_description,
    description: cabin.description,
    capacity: cabin.capacity,
    bedrooms: cabin.bedrooms,
    size: `${cabin.size_m2} m²`,
    price: `od ${Number(cabin.price_from_eur).toFixed(0)} € / noć`,
  };
}

module.exports = { listCabins, getCabin, getAvailability, findCabinBySlug };
