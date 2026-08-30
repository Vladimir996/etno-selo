const express = require("express");
const { listCabins, getCabin, getAvailability } = require("../controllers/cabinsController");

const router = express.Router();

router.get("/", listCabins);
router.get("/:slug", getCabin);
router.get("/:slug/availability", getAvailability);

module.exports = router;
