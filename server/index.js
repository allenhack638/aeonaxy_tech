// const express = require("express");
// const jwt = require("jsonwebtoken");
// const CryptoJS = require("crypto-js");
// const bcrypt = require("bcrypt");
// const rateLimit = require("express-rate-limit");
// const authoriseUser = require("./MiddleWare/AuthUser");
// const sendVerificationEmail = require("./SendMail/NodeMailer_send_mail");
// const successEmailTemp = require("./Miscellaneous/successEmailTemp");
// const verifyEmailTemp = require("./Miscellaneous/verifyEmailTemp");
// const cors = require("cors");
// const app = express();
// require("dotenv").config();
// const sql = require("./Database/database");

// const port = process.env.PORT || 8000;
// const dev_mode = process.env.DEV_MODE === "true" ? true : false;

// const limiter = rateLimit({
//   windowMs: 2 * 60 * 1000,
//   max: 20,
// });

// // middle wares
// app.use(cors());
// app.use(express.json());
// app.use(limiter);

// const JWT_KEY = process.env.JWT_SECRET_KEY;
// const JWT_EXPIRY = process.env.JWT_EXPIRY_TIME;
// const CLIENT_BASE_URL = dev_mode
//   ? process.env.CLIENT_BASE_URL_DEV_MOD
//   : process.env.CLIENT_BASE_URL;

// // console.log("the dev mode is", CLIENT_BASE_URL);
// const CRYPTO_JS_KEY = process.env.CRYPTO_JS_KEY;

// app.get("/", async (req, res) => {
//   res.send("Test Route");
// });

// app.post("/api/signup", async (req, res) => {
//   const { name, email, username, password } = req.body;
//   try {
//     const existingEmail =
//       await sql`SELECT * FROM Users_table WHERE email = ${email}`;
//     const existingUsername =
//       await sql`SELECT * FROM Users_table WHERE username = ${username}`;

//     let errors = {};

//     if (existingEmail.length > 0) {
//       errors.email = "Email already exists";
//     }

//     if (existingUsername.length > 0) {
//       errors.username = "Username already exists";
//     }

//     if (Object.keys(errors).length > 0) {
//       return res.status(400).json(errors);
//     } else {
//       const decryptedPassword = CryptoJS.AES.decrypt(
//         password,
//         CRYPTO_JS_KEY
//       ).toString(CryptoJS.enc.Utf8);
//       const hashedPassword = await bcrypt.hash(decryptedPassword, 10);
//       const newUser = await sql`
//       INSERT INTO Users_table (name, username, email, password)
//       VALUES (${name}, ${username}, ${email}, ${hashedPassword})
//       RETURNING id
//     `;

//       const tokenPayload = {
//         userId: newUser[0].id,
//         email: email,
//       };
//       const token = jwt.sign(tokenPayload, JWT_KEY, {
//         expiresIn: JWT_EXPIRY,
//       });
//       return res.status(200).json({
//         message: "No duplicate email or username found",
//         token: token,
//       });
//     }
//   } catch (error) {
//     console.error("Error checking existing data:", error);
//     return res.status(500).send("Error checking existing data");
//   }
// });

// app.post("/api/login", async (req, res) => {
// const { email, password } = req.body;

// try {
//   const user = await sql`
//   SELECT * FROM Users_table WHERE email = ${email}
// `;

//   if (user.length === 0) {
//     return res.status(401).json({
//       email: "Invalid email or password",
//       password: "Invalid email or password",
//     });
//   }
//   const userData = user[0];
//   const decryptedPassword = CryptoJS.AES.decrypt(
//     password,
//     CRYPTO_JS_KEY
//   ).toString(CryptoJS.enc.Utf8);
//   const isPasswordMatch = await bcrypt.compare(
//     decryptedPassword,
//     userData.password
//   );
//   if (!isPasswordMatch) {
//     return res.status(401).json({
//       email: "Invalid email or password",
//       password: "Invalid email or password",
//     });
//   }

//   if (!userData.isverified) {
//     const tokenPayload = {
//       userId: userData.id,
//       email: userData.email,
//     };

//     const token = jwt.sign(tokenPayload, JWT_KEY, {
//       expiresIn: JWT_EXPIRY,
//     });

//     return res.status(200).json({
//       message: "Login successful, account not verified",
//       isVerified: false,
//       data: {
//         token: token,
//         email: userData.email,
//       },
//     });
//   }

//   return res.status(200).json({
//     message: "Login successful",
//     isVerified: true,
//     data: {
//       username: userData.username,
//       name: userData.name,
//       imageUrl: userData.imageurl,
//       interests: userData.interests,
//       location: userData.location,
//       created_at: userData.created_at,
//     },
//   });
// } catch (error) {
//   console.error("Error checking login credentials:", error);
//   return res.status(500).send("Error checking login credentials");
// }
// });

// app.post("/api/addData", authoriseUser, async (req, res) => {
//   const { imageUrl, location, selectedCards } = req.body;
//   try {
//     const { email, userId } = req;

//     const interestsArrayString = `{${selectedCards
//       .map((interest) => `'${interest}'`)
//       .join(",")}}`;

//     await sql`
//       UPDATE Users_table
//       SET imageUrl = ${imageUrl},
//       location = ${location || "Not Specified"},
//       interests = array_cat(interests, ${interestsArrayString}::VARCHAR[])
//       WHERE email = ${email}
//     `;

//     const otpToken = jwt.sign({ email, userId }, JWT_KEY, {
//       expiresIn: JWT_EXPIRY,
//     });

//     const verificationLink = `${CLIENT_BASE_URL}/verify/${otpToken}`;

//     const user = await sql`SELECT name FROM Users_table WHERE email = ${email}`;

//     let name = "NA";
//     if (user.length > 0) {
//       name = user[0].name;
//     }
//     const htmlTemp = verifyEmailTemp(name, email, verificationLink);
//     await sendVerificationEmail(htmlTemp);
//     return res
//       .status(200)
//       .json({ message: "Verification email sent successfully" });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.get("/api/verify", authoriseUser, async (req, res) => {
// const { email } = req;
// try {
//   const userExists = await sql`
//   SELECT * FROM Users_table
//   WHERE email = ${email}
// `;

//   if (!userExists || !userExists.length) {
//     return res
//       .status(401)
//       .json({ error: "Unauthorized", message: "User not found" });
//   }

//   const user = userExists[0];
//   if (user.isverified) {
//     return res.status(200).json({ message: "Account already verified" });
//   }

//   const updateIsVerified = await sql`
//     UPDATE Users_table
//     SET isVerified = true
//     WHERE email = ${email}
//     RETURNING *;
//   `;

//   if (updateIsVerified.length === 1) {
//     const { name, email } = updateIsVerified[0];
//     const htmlTemp = successEmailTemp(name, email);
//     await sendVerificationEmail(htmlTemp);
//     res.status(200).json({
//       message: "Token verified",
//     });
//   } else {
//     res
//       .status(404)
//       .json({ error: "TokenExpiredError", message: "Token expired" });
//   }
// } catch (error) {
//   console.error("Error verifying token:", error);
//   res.status(500).json({ error: "Internal server error" });
// }
// });

// app.get("/api/send-mail", authoriseUser, async (req, res) => {
// const { email, userId } = req;
// try {
//   const userExists = await sql`
//   SELECT * FROM Users_table
//   WHERE email = ${email}
// `;

//   if (!userExists || !userExists.length) {
//     return res
//       .status(401)
//       .json({ error: "Unauthorized", message: "User not found" });
//   }

//   const user = userExists[0];
//   if (user.isverified) {
//     return res.status(200).json({
//       success: "alreadyVerified",
//       message: "Login successful",
//       data: {
//         username: user.username,
//         name: user.name,
//         imageUrl: user.imageurl,
//         interests: user.interests,
//         location: user.location,
//         created_at: user.created_at,
//       },
//     });
//   }

//   const otpToken = jwt.sign({ email, userId }, JWT_KEY, {
//     expiresIn: JWT_EXPIRY,
//   });

//   const verificationLink = `${CLIENT_BASE_URL}/verify/${otpToken}`;

//   const htmlTemp = verifyEmailTemp(
//     user?.name || "NA",
//     email,
//     verificationLink
//   );
//   await sendVerificationEmail(htmlTemp);
//   return res.status(200).json({
//     success: "verficationEmailSend",
//     message: "Verification email sent successfully",
//   });
// } catch (error) {
//   console.error("Error verifying token:", error);
//   res.status(500).json({ error: "Internal server error" });
// }
// });

// app.listen(port, () => {
//   console.log(`Server listening on ${port}`);
// });

// below is the neat and clean node js code

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 20,
});

app.use(cors());
app.use(express.json());
app.use(limiter);
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
