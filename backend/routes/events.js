const express = require("express");
const {
  createEvent,
  getAllEvents,
  deleteEvents,
  getEventsByDate,
  getEventsByMonth,
  updateEventById,
} = require("../controllers/eventController");

const router = express.Router();

router.post("/", createEvent);

router.get("/:date", getEventsByDate);

router.get("/month/:month", getEventsByMonth);

router.get("/", getAllEvents);

router.patch("/", updateEventById);

router.delete("/", deleteEvents);

module.exports = router;
