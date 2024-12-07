require("dotenv").config();

const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const eventRoutes = require("./routes/events");

// Middleware to allow Cross-Origin requests (CORS)
const cors = require("cors");
app.use(cors());
app.use(express.json());

// Example route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Start the server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

//routes
app.use("/api/events", eventRoutes);
// app.use("/api/user", userRoutes); idk if we need this

//connect to db
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
