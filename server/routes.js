const express = require("express");
const router = express.Router();
const authController = require("./controllers/authController");
const dataController = require("./controllers/dataController");
const authoriseUser = require("./middlewares/authMiddleware");

// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/verify", authoriseUser, authController.verify);
router.get("/send-mail", authoriseUser, authController.sendVerificationEmail);

// Data routes
router.post("/addData", authoriseUser, dataController.addData);

// Test route for testing purposes
router.get("/test", (req, res) => {
  res.send("This is a test route for testing purposes.");
});

module.exports = router;
