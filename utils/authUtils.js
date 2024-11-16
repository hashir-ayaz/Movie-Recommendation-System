// function to sign jwt and function to verify jwt
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}`,
  });
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Extract token from headers or cookies
const extractToken = (req) => {
  let token = req.headers.authorization;
  if (!token) {
    token = req.cookies?.token; // Check cookies if no token in headers
  }
  return token;
};

// Verify the token and get the user
const verifyTokenAndGetUser = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
  const user = await User.findById(decoded.id); // Find user by ID in the token
  return user;
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  extractToken,
  verifyTokenAndGetUser,
};
