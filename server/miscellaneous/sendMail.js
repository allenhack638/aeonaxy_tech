// miscellaneous/sendEmail.js
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendEmail = async (htmlTemp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    const info = await transporter.sendMail(htmlTemp);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};
