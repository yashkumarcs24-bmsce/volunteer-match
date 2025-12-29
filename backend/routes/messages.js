import express from "express";
import auth from "../middleware/auth.js";
import Message from "../models/Message.js";

const router = express.Router();

/* ---------------- GET CONVERSATIONS ---------------- */
router.get("/conversations", auth, async (req, res) => {
  try {
    // Get messages involving the user
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id },
        { receiverId: req.user.id }
      ]
    })
    .populate("senderId", "name avatar role")
    .populate("receiverId", "name avatar role")
    .populate("eventContext.opportunityId", "title")
    .sort({ createdAt: -1 });
    
    // Also get conversations from applications (for organizations)
    let applicationConversations = [];
    if (req.user.role === "org") {
      const Application = (await import("../models/Application.js")).default;
      const Opportunity = (await import("../models/Opportunity.js")).default;
      
      const applications = await Application.find()
        .populate({
          path: "opportunity",
          match: { createdBy: req.user.id },
          populate: { path: "createdBy", select: "name" }
        })
        .populate("applicant", "name avatar role")
        .exec();
      
      applicationConversations = applications
        .filter(app => app.opportunity) // Only include applications for user's opportunities
        .map(app => ({
          userId: app.applicant._id.toString(),
          user: app.applicant,
          opportunityTitle: app.opportunity.title,
          applicationStatus: app.status
        }));
    }
    
    const conversations = {};
    
    // Process messages
    messages.forEach(msg => {
      const otherUserId = msg.senderId._id.toString() === req.user.id ? msg.receiverId._id.toString() : msg.senderId._id.toString();
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          user: msg.senderId._id.toString() === req.user.id ? msg.receiverId : msg.senderId,
          messages: [],
          lastMessage: null,
          unreadCount: 0
        };
      }
      conversations[otherUserId].messages.push(msg);
      if (!conversations[otherUserId].lastMessage || new Date(msg.createdAt) > new Date(conversations[otherUserId].lastMessage.createdAt)) {
        conversations[otherUserId].lastMessage = msg;
      }
      if (msg.receiverId._id.toString() === req.user.id && !msg.read) {
        conversations[otherUserId].unreadCount++;
      }
    });
    
    // Add application-based conversations for organizations
    applicationConversations.forEach(appConv => {
      if (!conversations[appConv.userId]) {
        conversations[appConv.userId] = {
          user: appConv.user,
          messages: [],
          lastMessage: null,
          unreadCount: 0,
          opportunityTitle: appConv.opportunityTitle,
          applicationStatus: appConv.applicationStatus
        };
      } else {
        conversations[appConv.userId].opportunityTitle = appConv.opportunityTitle;
        conversations[appConv.userId].applicationStatus = appConv.applicationStatus;
      }
    });
    
    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
});

/* ---------------- SEND MESSAGE ---------------- */
router.post("/send", auth, async (req, res) => {
  try {
    const { receiverId, content, eventContext } = req.body;
    
    const message = new Message({
      senderId: req.user.id,
      receiverId,
      content,
      eventContext
    });
    
    await message.save();
    await message.populate("senderId receiverId", "name avatar");
    
    // Send real-time notification (disabled for serverless)
    // const io = req.app.get('io');
    // io.to(receiverId).emit('new_message', message);
    
    res.status(201).json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

/* ---------------- MARK AS READ ---------------- */
router.put("/read/:conversationId", auth, async (req, res) => {
  try {
    await Message.updateMany(
      {
        senderId: req.params.conversationId,
        receiverId: req.user.id,
        read: false
      },
      { read: true }
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking messages as read:', err);
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

export default router;