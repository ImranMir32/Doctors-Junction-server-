const express = require("express");
const { getNotifications } = require("../controllers/notificationsControllers");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, getNotifications);

module.exports = router;
