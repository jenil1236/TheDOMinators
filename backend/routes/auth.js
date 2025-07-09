import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import passport from "passport";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// LOGIN
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    message: "User logged in successfully",
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// ME (protected route)
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
});

export default router;
