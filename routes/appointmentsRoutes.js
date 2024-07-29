const express = require("express");
const {
  bookappointment,
  getAllappointments,
  personalAppointments,
  requestAppointments,
  Accpeted,
} = require("../controllers/appointmentsController");
const auth = require("../middleware/auth");

const router = express.Router();

router
  .post("/", auth, bookappointment)
  .get("/", auth, getAllappointments)
  .get("/:id", auth, personalAppointments)
  .get("/requests/:id", auth, requestAppointments)
  .put("/", auth, Accpeted);

module.exports = router;
