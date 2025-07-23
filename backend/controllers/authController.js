// controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Otp from "../models/Otp.js";
import { sendOTP } from "../utils/sendMail.js";
import CarpoolUser from "../models/CarpoolUser.js";
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 👤 Create new user
    const user = await User.create({ username, email, password });

    // 🚗 Create linked CarpoolUser (or any related schema)
    const carpoolUser = new CarpoolUser({ user: user._id });
    await carpoolUser.save();

    // 🔐 Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Send response
    res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token, // <-- Include token in response
      message: "User registered successfully",
      isAdmin: req.session?.isAdmin || false
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = (req, res) => {
  const user = {
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  }
  const token = jwt.sign(
    { userId: user._id }, // Payload
    process.env.JWT_SECRET, // Secret key (must be set in .env)
    { expiresIn: "7d" }     // Optional: token expiry
  );
  res.status(200).json({
    user,
    token,
    message: "User logged in successfully",
    isAdmin: req.session.isAdmin || false
  });
};

export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.isAdmin = false;
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
};

export const getMe = (req, res) => {
  if (req.isAdmin)
    return res.json({ isAdmin: req.isAdmin });
  else if (req.isAuthenticated()) {
    return res.status(200).json({
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
      isAdmin: false
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({ email, otp });
  await sendOTP(email, otp);
  res.json({ message: "OTP sent to email" });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: "Invalid or expired OTP" });
  res.json({ message: "OTP verified" });
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const hashed = await bcrypt.hash(newPassword, 10);
  await User.updateOne({ email }, { password: hashed });
  await Otp.deleteMany({ email });
  res.json({ message: "Password reset successful" });
};
