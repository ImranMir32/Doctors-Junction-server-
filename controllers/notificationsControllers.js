const Notifications = require("../models/notifications.model");

const getNotifications = async (req, res) => {
  try {
    const notifs = await Notifications.find({ userId: req.locals });
    return res.send(notifs);
  } catch (error) {
    res.status(500).send("Unable to get all notifications");
  }
};

module.exports = {
  getNotifications,
};
