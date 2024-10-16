// Define user types
const UserType = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

// Checks if a user is logged in
export function isLoggedIn(req) {
  return !!req.user; // More concise check for truthiness
}

// Function to check if the logged-in user is an admin
export function isAdminValid(req) {
  return req.user && req.user.type === UserType.ADMIN;
}

// Function to check if the logged-in user is a customer
export function isCustomerValid(req) {
  return req.user && req.user.type === UserType.CUSTOMER;
}

// Middleware for checking admin privileges
export const checkAdminAuth = (req, res, next) => {
  if (!isLoggedIn(req)) {
    return res.status(401).json({
      message: "Please log in to access this resource.",
    });
  }

  if (!isAdminValid(req)) {
    return res.status(403).json({
      message: "You do not have permission to access this resource.",
    });
  }

  next(); // Proceed if the user is both logged in and an admin
};

// Middleware for checking if the user is logged in
export const checkAuth = (req, res, next) => {
  if (!isLoggedIn(req)) {
    return res.status(401).json({
      message: "Please log in to access this resource.",
    });
  }
  next(); // Proceed if the user is logged in
};
