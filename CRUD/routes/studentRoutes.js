const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middleware/auth");

router.get("/view", authMiddleware, studentController.viewOwnDetails);

module.exports = router;
