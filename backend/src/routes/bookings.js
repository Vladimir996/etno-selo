const express = require("express");
const { listBookings, createBooking, updateBookingStatus } = require("../controllers/bookingsController");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.get("/", requireAdmin, listBookings);
router.post("/", createBooking);
router.patch("/:id", requireAdmin, updateBookingStatus);

module.exports = router;
