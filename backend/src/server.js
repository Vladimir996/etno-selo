require("dotenv").config();
const express = require("express");
const cors = require("cors");

const requestLogger = require("./middleware/requestLogger");
const cabinsRouter = require("./routes/cabins");
const bookingsRouter = require("./routes/bookings");
const authRouter = require("./routes/auth");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map((s) => s.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(requestLogger);

app.get("/api", (req, res) => res.json({ ok: true, service: "etno-selo-raonica-backend" }));
app.use("/api/auth", authRouter);
app.use("/api/cabins", cabinsRouter);
app.use("/api/bookings", bookingsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta nije pronađena." });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Greška na serveru." });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Backend sluša na http://localhost:${port}`);
});
