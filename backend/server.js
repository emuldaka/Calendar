require("dotenv").config();

const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");

const cors = require("cors");

// Configure CORS to allow credentials and dynamically set the origin
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000", // Local frontend
        "https://emuldaka.site", // Production frontend
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Basic route for testing server status
app.get("/api", (req, res) => {
  res.json({ message: "Server Initialized" });
});

// Define routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

// Connect to MongoDB and start the server
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
