import jwt from "jsonwebtoken";

// Middleware to authenticate JSON Web Tokens (JWT)
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        // Token is invalid
        return res.status(401).json({
          message: "Invalid token",
          error: err.message,
        });
      }

      req.user = decoded;
      next();
    });
  } else {
    next();
  }
};

export default authenticateToken;
