const UserType = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

// Function to check if the logged-in user is an admin
export function isAdminValid(req) {
  return req.user && req.user.type === UserType.ADMIN;
}

// Function to check if the logged-in user is a customer
export function isCustomerValid(req) {
  return req.user && req.user.type === UserType.CUSTOMER;
}

// Checks if a user is logged in
export function isLoggedIn(req) {
  if (!req.user) {
    return false;
  }
  return true;
}

