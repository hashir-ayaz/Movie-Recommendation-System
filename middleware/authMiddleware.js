const { extractToken, verifyTokenAndGetUser } = require("../utils/authUtils");

exports.protect = async (req, res, next) => {
  try {
    // Extract token from request
    const token = extractToken(req);

    // If no token, return an error
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Verify token and get user
    const user = await verifyTokenAndGetUser(token);

    // If no user found, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request object and continue
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.adminProtect = async (req, res, next) => {
  try {
    // Extract token from request
    const token = extractToken(req);

    // If no token, return an error
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Verify token and get user
    const user = await verifyTokenAndGetUser(token);

    // If no user found, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // Attach user to request object and continue
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
