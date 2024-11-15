const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized");
const config = require("../config");

module.exports = (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];
    if (!token && req.headers["authorization"]) {
      const authHeader = req.headers["authorization"];
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); 
      }
    }

    if (!token) {
      console.log("No token provided");
      throw "Token is missing";
    }

    const decoded = jwt.verify(token, config.secretJwtToken);
    console.log("Decoded Token:", decoded);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("Token validation failed:", err);
    next(new UnauthorizedError("Invalid token"));
  }
};
