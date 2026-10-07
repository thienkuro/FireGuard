const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const { getAllDevices,getDeviceById,getDeviceHistory,sendCommand } = require("../controllers/deviceController");

router.get("/", authenticate, getAllDevices);
router.get("/:id/history", authenticate, getDeviceHistory);
router.get("/:id", authenticate, getDeviceById);
router.post("/:id/commands", authenticate, sendCommand);

module.exports = router;