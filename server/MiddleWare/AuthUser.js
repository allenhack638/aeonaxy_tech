const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_KEY = process.env.JWT_SECRET_KEY;

const authoriseUser = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  let token;

  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    token = authorizationHeader.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_KEY);
      req.userId = decoded.userId;
      req.email = decoded.email;

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res
          .status(401)
          .json({ error: "TokenExpiredError", message: "Token expired" });
      } else {
        console.error("Error verifying token:", error);
        res
          .status(401)
          .json({ error: "Unauthorized", message: "Unauthorized access" });
      }
    }
  } else {
    res
      .status(401)
      .json({ error: "Unauthorized", message: "Something went wrong" });
  }
};

module.exports = authoriseUser;
