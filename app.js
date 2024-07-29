require("./config/db");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const doctorsRoutes = require("./routes/doctorsRoutes");
const appointmentsRoutes = require("./routes/appointmentsRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: false })); // To parse URL-encoded bodies
app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/doctor", doctorsRoutes);
app.use("/api/appointment", appointmentsRoutes);
app.use("/api/notifications", notificationsRoutes);

module.exports = app;
