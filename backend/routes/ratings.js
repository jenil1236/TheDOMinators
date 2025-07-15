import express from "express";
import { rateUser, getUserRatings } from "../controllers/ratingController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Submit a new rating (POST /api/ratings)
router.post("/", protect, rateUser);

// Get all ratings for a user (GET /api/ratings/:userId)
router.get("/:userId", protect, getUserRatings);

export default router;
