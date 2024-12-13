const express = require("express");
const {
  createEvent,
  getEvent,
  getAllEvents,
  deleteEvents,
  updateEvent,
  getEvents,
  getEventsByDate,
} = require("../controllers/eventController");

const router = express.Router();

//require auth for all event routes
// router.use(requireAuth)
//^^ if we want auth in future

router.post("/", createEvent);

router.get("/:date", getEventsByDate);

router.get("/", getAllEvents);

router.delete("/", deleteEvents);

module.exports = router;
