const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const { login, profile } = require("../controllers/authController");

router.post("/login", login);

router.get("/profile", authenticate, profile);

module.exports = router;