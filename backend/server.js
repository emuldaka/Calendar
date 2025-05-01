require("dotenv").config();

const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");

const cors = require("cors");
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Server Initialized" });
});

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || port, () => {
      console.log(
        "Connected to DB & listening on port " + (process.env.PORT || port)
      );
    });
  })
  .catch((error) => {
    console.log("Database connection error:", error);
  });
