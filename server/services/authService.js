// services/authService.js
const sql = require("../databases/database");
const {
  successEmailTemp,
  verifyEmailTemp,
} = require("../miscellaneous/emailTemplates");
const { sendEmail } = require("../miscellaneous/sendMail");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");

require("dotenv").config();
const dev_mode = process.env.DEV_MODE === "true" ? true : false;
const JWT_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRY = process.env.JWT_EXPIRY_TIME;
const CLIENT_BASE_URL = dev_mode
  ? process.env.CLIENT_BASE_URL_DEV_MOD
  : process.env.CLIENT_BASE_URL;

const CRYPTO_JS_KEY = process.env.CRYPTO_JS_KEY;

exports.signup = async (req, res) => {
  const { name, email, username, password } = req.body;

  try {
    const existingEmail =
      await sql`SELECT * FROM Users_table WHERE email = ${email}`;
    const existingUsername =
      await sql`SELECT * FROM Users_table WHERE username = ${username}`;

    let errors = {};

    if (existingEmail.length > 0) {
      errors.email = "Email already exists";
    }

    if (existingUsername.length > 0) {
      errors.username = "Username already exists";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    } else {
      const decryptedPassword = CryptoJS.AES.decrypt(
        password,
        CRYPTO_JS_KEY
      ).toString(CryptoJS.enc.Utf8);
      const hashedPassword = await bcrypt.hash(decryptedPassword, 10);
      const newUser = await sql`
      INSERT INTO Users_table (name, username, email, password)
      VALUES (${name}, ${username}, ${email}, ${hashedPassword})
      RETURNING id
    `;

      const tokenPayload = {
        userId: newUser[0].id,
        email: email,
      };
      const token = jwt.sign(tokenPayload, JWT_KEY, {
        expiresIn: JWT_EXPIRY,
      });
      return res.status(200).json({
        message: "No duplicate email or username found",
        token: token,
      });
    }
  } catch (error) {
    console.error("Error checking existing data:", error);
    return res.status(500).send("Error checking existing data");
  }
};
exports.login = async (req, res) => {
  console.log("ROute hittin");
  const { email, password } = req.body;

  try {
    const user = await sql`
    SELECT * FROM Users_table WHERE email = ${email}
  `;

    if (user.length === 0) {
      return res.status(401).json({
        email: "Invalid email or password",
        password: "Invalid email or password",
      });
    }
    const userData = user[0];
    const decryptedPassword = CryptoJS.AES.decrypt(
      password,
      CRYPTO_JS_KEY
    ).toString(CryptoJS.enc.Utf8);
    const isPasswordMatch = await bcrypt.compare(
      decryptedPassword,
      userData.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({
        email: "Invalid email or password",
        password: "Invalid email or password",
      });
    }

    if (!userData.isverified) {
      const tokenPayload = {
        userId: userData.id,
        email: userData.email,
      };

      const token = jwt.sign(tokenPayload, JWT_KEY, {
        expiresIn: JWT_EXPIRY,
      });

      return res.status(200).json({
        message: "Login successful, account not verified",
        isVerified: false,
        data: {
          token: token,
          email: userData.email,
        },
      });
    }

    return res.status(200).json({
      message: "Login successful",
      isVerified: true,
      data: {
        username: userData.username,
        name: userData.name,
        imageUrl: userData.imageurl,
        interests: userData.interests,
        location: userData.location,
        created_at: userData.created_at,
      },
    });
  } catch (error) {
    console.error("Error checking login credentials:", error);
    return res.status(500).send("Error checking login credentials");
  }
};
exports.verify = async (req, res) => {
  const { email } = req;
  try {
    const userExists = await sql`
      SELECT * FROM Users_table
      WHERE email = ${email}
    `;

    if (!userExists || !userExists.length) {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "User not found" });
    }

    const user = userExists[0];
    if (user.isverified) {
      return res.status(200).json({ message: "Account already verified" });
    }

    const updateIsVerified = await sql`
        UPDATE Users_table
        SET isVerified = true
        WHERE email = ${email}
        RETURNING *;
      `;

    if (updateIsVerified.length === 1) {
      const { name, email } = updateIsVerified[0];
      const htmlTemp = successEmailTemp(name, email);
      await sendEmail(htmlTemp);
      res.status(200).json({
        message: "Token verified",
      });
    } else {
      res
        .status(404)
        .json({ error: "TokenExpiredError", message: "Token expired" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.sendVerificationEmail = async (req, res) => {
  const { email, userId } = req;
  try {
    const userExists = await sql`
      SELECT * FROM Users_table
      WHERE email = ${email}
    `;

    if (!userExists || !userExists.length) {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "User not found" });
    }

    const user = userExists[0];
    if (user.isverified) {
      return res.status(200).json({
        success: "alreadyVerified",
        message: "Login successful",
        data: {
          username: user.username,
          name: user.name,
          imageUrl: user.imageurl,
          interests: user.interests,
          location: user.location,
          created_at: user.created_at,
        },
      });
    }

    const otpToken = jwt.sign({ email, userId }, JWT_KEY, {
      expiresIn: JWT_EXPIRY,
    });

    const verificationLink = `${CLIENT_BASE_URL}/verify/${otpToken}`;

    const htmlTemp = verifyEmailTemp(
      user?.name || "NA",
      email,
      verificationLink
    );
    await sendEmail(htmlTemp);
    return res.status(200).json({
      success: "verficationEmailSend",
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
