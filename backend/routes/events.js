const express = require("express");
const {
  createEvent,
  getEvent,
  getAllEvents,
  deleteEvent,
  updateEvent,
  getEvents,
  getEventsByDate,
} = require("../controllers/eventController");

const router = express.Router();

//require auth for all event routes
// router.use(requireAuth)
//^^ if we want auth in future

router.post("/", createEvent);

// router.get("/:date", getEventsByDate);

// router.get("/get", getAllEvents);

module.exports = router;
