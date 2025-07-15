import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import CarpoolUser from "../models/CarpoolUser.js";

// Create or get existing chat between two users
export const getOrCreateChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === userId) {
      return res.status(400).json({ message: "Cannot start a chat with yourself." });
    }

    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId], $size: 2 },
    }).populate("participants", "user");

    if (!chat) {
      chat = new Chat({
        participants: [currentUserId, userId],
      });
      await chat.save();

      // Update each user's chat list
      await Promise.all([
        CarpoolUser.findByIdAndUpdate(currentUserId, {
          $addToSet: { chats: chat._id },
        }),
        CarpoolUser.findByIdAndUpdate(userId, {
          $addToSet: { chats: chat._id },
        }),
      ]);

      await chat.populate("participants", "user");
    }

    return res.status(200).json(chat);
  } catch (error) {
    console.error("Error in getOrCreateChat:", error);
    return res.status(500).json({ message: "Something went wrong while starting chat." });
  }
};

// Send message inside a chat
export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const senderId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const message = new Message({
      chat: chatId,
      sender: senderId,
      text,
    });

    await message.save();

    chat.messages.push(message._id);
    await chat.save();

    await message.populate("sender", "user");

    return res.status(200).json(message);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({ message: "Something went wrong while sending message." });
  }
};

// Get all chats for current user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "user")
      .populate({
        path: "messages",
        populate: {
          path: "sender",
          select: "user",
        },
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json(chats);
  } catch (error) {
    console.error("Error in getUserChats:", error);
    return res.status(500).json({ message: "Something went wrong while fetching chats." });
  }
};

// Get messages for a specific chat
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "user")
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getChatMessages:", error);
    return res.status(500).json({ message: "Something went wrong while fetching messages." });
  }
};
