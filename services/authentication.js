import jwt from "jsonwebtoken";

// Middleware to authenticate JSON Web Tokens (JWT)
const authenticateToken = (req, res, next) => {
  // Extract the token from the "Authorization" header
  // Expected format: "Bearer <token>"
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If a token is provided, proceed with verification
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        // Handle invalid token errors
        return res.status(401).json({
          message: "Invalid token",
          error: err.message, // Provide error details for debugging
        });
      }

      // If the token is valid, attach decoded user information to the request body
      req.body.user = decoded;

      // Proceed to the next middleware or route handler
      next();
    });
  } else {
    // If no token is provided, allow the request to proceed (optional authentication)
    next();
  }
};

export default authenticateToken;
