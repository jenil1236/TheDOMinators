import express from "express";
import {
  postRide,
  searchRides,
  getPostedRides,
  getBookedRides,
  getRideHistory,
  cancelUpcomingRide
} from "../controllers/rideController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Post a new ride
router.post("/post", protect, postRide); // done test

// Search rides by pickup/drop/date
router.get("/search", protect, searchRides); // done test

// Get rides posted by logged-in user
router.get("/posted", protect, getPostedRides); // done test

// Get rides booked by logged-in user
router.get("/booked", protect, getBookedRides); // pending

// Get ride history (both posted and booked, completed/cancelled)
router.get("/history", protect, getRideHistory); // pending

// Cancel an upcoming ride
router.post("/cancel", protect, cancelUpcomingRide); // pending

export default router;
