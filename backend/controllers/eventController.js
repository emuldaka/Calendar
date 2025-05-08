const Event = require("../models/eventModel");
const mongoose = require("mongoose");

// Creating a new event
const createEvent = async (req, res) => {
  const { title, date } = req.body;
  const userId = req.userId;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!date) {
    emptyFields.push("date");
  }
  if (!userId) {
    return res.status(401).json({ error: "User authentication required" });
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  try {
    console.log("createEvent input:", { title, date, userId });
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      throw new Error(`Invalid date format: ${date}`);
    }
    console.log("createEvent date before save:", {
      eventDate,
      type: eventDate instanceof Date,
    });
    const event = await Event.create({ title, date: eventDate, userId });
    console.log("createEvent result:", {
      ...event.toObject(),
      date: event.date.toISOString(),
      dateType: typeof event.date,
      dateInstance: event.date instanceof Date,
    });
    res.status(200).json({
      ...event.toObject(),
      date: event.date.toISOString(),
    });
  } catch (error) {
    console.error("createEvent error:", error.message, { title, date, userId });
    res.status(400).json({ error: error.message });
  }
};

// Fetching all events for a user
const getAllEvents = async (req, res) => {
  const userId = req.userId;
  try {
    console.log("getAllEvents input:", { userId });
    const allEvents = await Event.find({ userId }).lean();
    const normalizedEvents = allEvents.map((event) => ({
      ...event,
      date: new Date(event.date).toISOString(),
    }));
    const sampleEvent = normalizedEvents[0];
    console.log("getAllEvents sample event:", {
      date: sampleEvent?.date,
      dateType: typeof sampleEvent?.date,
      dateInstance: sampleEvent?.date instanceof Date,
    });
    console.log("getAllEvents result:", {
      eventCount: normalizedEvents.length,
      events: normalizedEvents,
    });
    res.status(200).json(normalizedEvents);
  } catch (error) {
    console.error("getAllEvents error:", error.message, { userId });
    res.status(400).json({ error: error.message });
  }
};

// Fetching events for a specific date
const getEventsByDate = async (req, res) => {
  const userId = req.userId;
  const dateParam = req.params.date;

  try {
    console.log("getEventsByDate input:", { userId, dateParam });

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateParam)) {
      throw new Error(`Invalid date format: ${dateParam}. Expected YYYY-MM-DD`);
    }

    const startOfDay = new Date(`${dateParam}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateParam}T23:59:59.999Z`);

    // Validate constructed dates
    if (isNaN(startOfDay.getTime()) || isNaN(endOfDay.getTime())) {
      throw new Error(`Invalid date constructed from: ${dateParam}`);
    }

    console.log("getEventsByDate query:", {
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString(),
    });

    const eventsByDate = await Event.find({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).lean();

    const normalizedEvents = eventsByDate.map((event) => ({
      ...event,
      date: new Date(event.date).toISOString(),
    }));

    console.log("getEventsByDate result:", {
      eventCount: normalizedEvents.length,
      events: normalizedEvents,
    });

    res.status(200).json(normalizedEvents);
  } catch (error) {
    console.error("getEventsByDate error:", error.message, {
      userId,
      dateParam,
    });
    res.status(400).json({ error: error.message });
  }
};

// Fetching events for a specific month
const getEventsByMonth = async (req, res) => {
  const userId = req.userId;
  const monthParam = req.params.month;

  try {
    console.log("getEventsByMonth input:", { userId, monthParam });

    // Validate month format (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(monthParam)) {
      throw new Error(`Invalid month format: ${monthParam}. Expected YYYY-MM`);
    }

    const [year, month] = monthParam.split("-").map(Number);
    const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    // Validate constructed dates
    if (isNaN(startOfMonth.getTime()) || isNaN(endOfMonth.getTime())) {
      throw new Error(`Invalid month constructed from: ${monthParam}`);
    }

    console.log("getEventsByMonth query:", {
      startOfMonth: startOfMonth.toISOString(),
      endOfMonth: endOfMonth.toISOString(),
    });

    const eventsByMonth = await Event.find({
      userId,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    }).lean();

    const normalizedEvents = eventsByMonth.map((event) => ({
      ...event,
      date: new Date(event.date).toISOString(),
    }));

    console.log("getEventsByMonth result:", {
      eventCount: normalizedEvents.length,
      events: normalizedEvents,
    });

    res.status(200).json(normalizedEvents);
  } catch (error) {
    console.error("getEventsByMonth error:", error.message, {
      userId,
      monthParam,
    });
    res.status(400).json({ error: error.message });
  }
};

// Deleting multiple events
const deleteEvents = async (req, res) => {
  const userId = req.userId;
  try {
    const request = req.body.data;
    console.log("deleteEvents input:", { userId, eventIds: request });

    if (!Array.isArray(request) || request.length === 0) {
      return res.status(400).json({ error: "No event IDs provided" });
    }

    const deleteRequests = await Event.deleteMany({
      userId,
      _id: { $in: request },
    });

    console.log("deleteEvents result:", {
      deletedCount: deleteRequests.deletedCount,
    });

    res.status(200).json({ message: "Events deleted successfully" });
  } catch (error) {
    console.error("deleteEvents error:", error.message, { userId, request });
    res.status(400).json({ error: error.message });
  }
};

// Updating an event by ID
const updateEventById = async (req, res) => {
  const userId = req.userId;
  const { id, title } = req.body;

  try {
    console.log("updateEventById input:", { userId, id, title });

    if (!id || !title) {
      return res.status(400).json({ error: "Event ID and title are required" });
    }

    const updateEvent = await Event.findOneAndUpdate(
      { _id: id, userId },
      { $set: { title } },
      { returnDocument: "after" }
    ).lean();

    if (!updateEvent) {
      return res
        .status(404)
        .json({ error: "Event not found or not authorized" });
    }

    const normalizedEvent = {
      ...updateEvent,
      date: new Date(updateEvent.date).toISOString(),
    };

    console.log("updateEventById result:", normalizedEvent);
    res.status(200).json(normalizedEvent);
  } catch (error) {
    console.error("updateEventById error:", error.message, {
      userId,
      id,
      title,
    });
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByDate,
  getEventsByMonth,
  deleteEvents,
  updateEventById,
};
