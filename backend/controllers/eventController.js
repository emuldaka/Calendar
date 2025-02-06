const Event = require("../models/eventModel");
const mongoose = require("mongoose");

const createEvent = async (req, res) => {
  console.log(req.body);

  const { title, date } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!date) {
    emptyFields.push("date");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  try {
    const event = await Event.create({ title, date });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error.message);
  }
};

const getAllEvents = async (req, res) => {
  try {
    const allEvents = await Event.find();
    console.log(allEvents);
    res.status(200).json(allEvents);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error.message);
  }
};

const getEventsByDate = async (req, res) => {
  try {
    const startOfDay = new Date(`${req.params.date}T00:00:00.000Z`);
    const endOfDay = new Date(`${req.params.date}T23:59:59.999Z`);
    const eventsByDate = await Event.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    console.log(eventsByDate);
    res.status(200).json(eventsByDate);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error.message);
  }
};

const getEventsByMonth = async (req, res) => {
  try {
    const startOfMonth = new Date(`${req.params.month}-01T00:00:00.000Z`);
    const endOfMonth = new Date(`${req.params.month}-31T23:59:59.999Z`);
    const eventsByMonth = await Event.find({
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });
    console.log(eventsByMonth);
    res.status(200).json(eventsByMonth);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error.message);
  }
};

const deleteEvents = async (req, res) => {
  try {
    console.log("delete event", req.body);

    let request = req.body.data;
    const deleteRequests = await Event.deleteMany({ _id: { $in: request } });
    res.status(200).json("delete req recieved");
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error.message);
  }
};

const updateEventById = async (req, res) => {
  try {
    console.log("Update Event", req.body);
    const updateEvent = await Event.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { title: req.body.title } },
      { returnDocument: "after" }
    );
    res.status(200).json("update req recieved");
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error.message);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByDate,
  deleteEvents,
  getEventsByMonth,
  updateEventById,
};
