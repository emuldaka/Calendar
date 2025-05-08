const express = require("express");
const {
  createEvent,
  getAllEvents,
  deleteEvents,
  getEventsByDate,
  getEventsByMonth,
  updateEventById,
} = require("../controllers/eventController");
const jwt = require("jsonwebtoken");

const router = express.Router();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.id;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

router.post("/", verifyToken, createEvent);
router.get("/:date", verifyToken, getEventsByDate);
router.get("/month/:month", verifyToken, getEventsByMonth);
router.get("/", verifyToken, getAllEvents);
router.patch("/", verifyToken, updateEventById);
router.delete("/", verifyToken, deleteEvents);

module.exports = router;
