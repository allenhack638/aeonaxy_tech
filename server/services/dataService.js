// services/dataService.js
const sql = require("../databases/database");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../miscellaneous/sendMail");
const { verifyEmailTemp } = require("../miscellaneous/emailTemplates");
require("dotenv").config();

const dev_mode = process.env.DEV_MODE === "true" ? true : false;
const JWT_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRY = process.env.JWT_EXPIRY_TIME;
const CLIENT_BASE_URL = dev_mode
  ? process.env.CLIENT_BASE_URL_DEV_MOD
  : process.env.CLIENT_BASE_URL;

exports.addData = async (req, res) => {
  const { imageUrl, location, selectedCards } = req.body;
  try {
    const { email, userId } = req;

    const interestsArrayString = `{${selectedCards
      .map((interest) => `'${interest}'`)
      .join(",")}}`;

    await sql`
      UPDATE Users_table
      SET imageUrl = ${imageUrl},
      location = ${location || "Not Specified"},
      interests = array_cat(interests, ${interestsArrayString}::VARCHAR[])
      WHERE email = ${email}
    `;

    const otpToken = jwt.sign({ email, userId }, JWT_KEY, {
      expiresIn: JWT_EXPIRY,
    });

    const verificationLink = `${CLIENT_BASE_URL}/verify/${otpToken}`;

    const user = await sql`SELECT name FROM Users_table WHERE email = ${email}`;

    let name = "NA";
    if (user.length > 0) {
      name = user[0].name;
    }
    const htmlTemp = verifyEmailTemp(name, email, verificationLink);
    await sendEmail(htmlTemp);
    return res
      .status(200)
      .json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
