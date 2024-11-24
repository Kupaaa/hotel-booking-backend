import jwt from "jsonwebtoken";

// Middleware to authenticate and validate JSON Web Tokens (JWT)
const authMiddleware = (req, res, next) => {
  // Extract token from the Authorization header (Bearer <token>)
  const token = req.headers.authorization?.split(" ")[1];

  // If no token is provided, return a 401 Unauthorized error
  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  // Check if the JWT secret key is configured in the environment
  if (!process.env.JWT_KEY) {
    return res.status(500).json({ message: "Server configuration error" }); // Handle missing configuration
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Attach decoded token data (user information) to the request object
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Invalid token:", err.message);

    // Handle specific JWT errors for better error messages
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Generic error response for invalid tokens
    return res
      .status(401)
      .json({ message: "Invalid token", error: err.message });
  }
};

export default authMiddleware;
