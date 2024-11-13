const jwt = require("jsonwebtoken");

const User = require("../models/User");

const protect = async (req, res, next) => {
  // get token from headers
  const token = req.headers.authorization;

  // if no token in header then check cookies
  if (!token) {
    token = req.cookies.token;
  }

  // if no token, return error
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user by id from token
    const user = await User.findById(decoded.id);

    // if no user, return error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if user, attach user to request object
    req.user = user;

    // continue
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
