import express from "express";
import {
  getOrCreateChat,
  sendMessage,
  getUserChats,
  getChatMessages,
} from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js"; // Passport.js version

const router = express.Router();

// Create or get existing chat between two users
router.post("/start", protect, getOrCreateChat);

// Send message inside a chat
router.post("/send", protect, sendMessage);

// Get all chats for current user
router.get("/my-chats", protect, getUserChats);

// Get all messages for a specific chat
router.get("/:chatId/messages", protect, getChatMessages);

export default router;
