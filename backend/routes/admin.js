import express from "express";
import { protect } from "../middleware/auth.js";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import { getAllMessages } from "../controllers/chatController.js";
import { getAllRatingsAdmin } from "../controllers/ratingController.js";
import { getAllJoinRequestsAdmin } from "../controllers/requestController.js";
import { getAllRidesAdminGrouped } from "../controllers/rideController.js";

const router = express.Router();

router.get("/messages", protect,  getAllMessages);
router.get("/ratings", protect,  getAllRatingsAdmin);
router.get("/requests", protect,  getAllJoinRequestsAdmin);
router.get("/rides", protect,  getAllRidesAdminGrouped);





export default router;

