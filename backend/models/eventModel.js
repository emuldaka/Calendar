const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  date: {
    type: Date,
    required: [true, "Please add a date"],
  },
  userId: {
    type: String,
    required: [true, "Please associate an event with a user"],
  },
});

module.exports = mongoose.model("Event", eventSchema);
