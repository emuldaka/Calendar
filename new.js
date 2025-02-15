// imports
const { getAllEvents } = require("../controllers/eventController");
const express = require("express");

const router = express.Router(); // The express.Router() method creates an instance of an Express router.
// The *router* variable now holds this router instance.
//  You can use this instance to define routes and associate functions with them.

// Your code here

router.get("/", getAllEvents);
