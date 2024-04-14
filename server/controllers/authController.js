// controllers/authController.js
const {
  signup,
  login,
  verify,
  sendVerificationEmail,
} = require("../services/authService");

exports.signup = signup;
exports.login = login;
exports.verify = verify;
exports.sendVerificationEmail = sendVerificationEmail;
