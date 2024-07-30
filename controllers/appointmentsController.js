const Appointments = require("../models/appointments.model");
const Notifications = require("../models/notifications.model");
const User = require("../models/users.model");

const getAllappointments = async (req, res) => {
  try {
    const allAppointments = await Appointments.find({})
      .populate("userId")
      .populate("doctorId");

    // console.log("Appointments fetched successfully", allAppointments);
    return res.send(allAppointments);
  } catch (error) {
    // console.error("Error fetching applicants:", error);
    return res.status(500).send(`Unable to get non-doctors: ${error.message}`);
  }
};

const personalAppointments = async (req, res) => {
  try {
    const allAppointments = await Appointments.find({ userId: req.params.id })
      .populate("userId")
      .populate("doctorId");

    // console.log("Personal Appointments fetched successfully", allAppointments);
    return res.send(allAppointments);
  } catch (error) {
    // console.error("Error fetching applicants:", error);
    return res.status(500).send(`Unable to get non-doctors: ${error.message}`);
  }
};

const requestAppointments = async (req, res) => {
  try {
    const allAppointments = await Appointments.find({ doctorId: req.params.id })
      .populate("userId")
      .populate("doctorId");

    // console.log("Appointments fetched successfully", allAppointments);
    return res.send(allAppointments);
  } catch (error) {
    // console.error("Error fetching applicants:", error);
    return res.status(500).send(`Unable to get non-doctors: ${error.message}`);
  }
};

const bookappointment = async (req, res) => {
  try {
    const appointment = await Appointments({
      date: req.body.date,
      time: req.body.time,
      doctorId: req.body.doctorId,
      userId: req.locals,
    });

    const usernotification = Notifications({
      userId: req.locals,
      content: `You booked an appointment with Dr. ${req.body.doctorname} for ${req.body.date} ${req.body.time}`,
    });

    await usernotification.save();

    const user = await User.findById(req.locals);

    const doctornotification = Notifications({
      userId: req.body.doctorId,
      content: `You have an appointment with ${user.name} on ${req.body.date} at ${req.body.time}`,
    });

    await doctornotification.save();

    const result = await appointment.save();
    return res
      .status(201)
      .send({ result, msg: "Your appointment has been booked successfully" });
  } catch (error) {
    // console.log("error", error);
    res.status(500).send("Unable to book appointment");
  }
};

const Accpeted = async (req, res) => {
  try {
    const alreadyFound = await Appointments.findOneAndUpdate(
      { _id: req.body.appointid },
      { status: "Accepted" }
    );

    const usernotification = Notifications({
      userId: req.body.userId,
      content: `Your appointment with Dr. ${req.body.doctorname} has been Accpeted`,
    });

    await usernotification.save();

    return res.status(201).send("Appointment Accpeted");
  } catch (error) {
    res.status(500).send("Unable to complete appointment");
  }
};

module.exports = {
  personalAppointments,
  getAllappointments,
  bookappointment,
  Accpeted,
  requestAppointments,
};
