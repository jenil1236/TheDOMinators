import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import configurePassport from "./config/passport.js"; // 👈 new

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

// 💡 SESSION middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  }
}));

// 💡 PASSPORT initialization
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// 💡 Routes
app.use("/api/users", authRoutes);

// 💡 DB connect and start server
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
