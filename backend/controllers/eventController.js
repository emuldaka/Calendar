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

  // add event to data base
  try {
    const event = await Event.create({ title, date });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllEvents = async (req, res) => {
  const allEvents = await Event.find();
  console.log(allEvents);
  res.status(200).json(allEvents);
};

const getEventsByDate = async (req, res) => {
  const date = new Date(req.params.date);
  console.log(date);
  const eventsByDate = await Event.find({
    date: date,
  });
  console.log(eventsByDate);
  res.status(200).json(eventsByDate);
};

const deleteEvents = async (req, res) => {
  console.log("delete event", req.body);

  let request = req.body.data;
  const deleteRequests = await Event.deleteMany({ _id: { $in: request } });
  res.status(200).json("delete req recieved");
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByDate,
  deleteEvents,
};
