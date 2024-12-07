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

// const getEvents = async (req, res) => {
//   res.status(200).json(events);
// };

module.exports = {
  createEvent,
};
