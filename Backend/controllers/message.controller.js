import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../Routes/socket.js";

export const sendMessage = async (req, res) => {
	try {
	  const { message } = req.body;
	  const { id: receiverId } = req.params;
	  const senderId = req.user._id;
  
	  console.log("Received message request:", { senderId, receiverId, message });
  
	  // Check if a conversation already exists
	  let conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] },
	  });
  
	  if (!conversation) {
		console.log("No existing conversation found, creating a new one.");
		conversation = await Conversation.create({
		  participants: [senderId, receiverId],
		});
		console.log("New conversation created:", conversation);
	  }
  
	  // Create a new message
	  const newMessage = new Message({
		senderId,
		receiverId,
		message,
	  });
  
	  console.log("New message created:", newMessage);
  
	  if (newMessage) {
		conversation.messages.push(newMessage._id);
		console.log("New message added to conversation:", newMessage._id);
	  }
  
	  // Save conversation and message
	  await Promise.all([conversation.save(), newMessage.save()]);
	  console.log("Conversation and message saved successfully.");
  
	  // SOCKET IO FUNCTIONALITY
	  const receiverSocketId = getReceiverSocketId(receiverId);
	  if (receiverSocketId) {
		console.log("Receiver socket ID found:", receiverSocketId);
		io.to(receiverSocketId).emit("newMessage", newMessage);
		console.log("Message sent to receiver via socket.");
	  } else {
		console.log("No socket ID found for receiver.");
	  }
  
	  res.status(201).json(newMessage);
	} catch (error) {
	  console.error("Error in sendMessage controller:", error.message);
	  res.status(500).json({ error: "Internal server error" });
	}
  };

  export const getMessages = async (req, res) => {
	try {
	  const { id: userToChatId } = req.params;
	  const senderId = req.user._id;
  
	  console.log("Received getMessages request:", { senderId, userToChatId });
  
	  const conversation = await Conversation.findOne({
		participants: { $all: [senderId, userToChatId] },
	  }).populate("messages"); // Fetches actual messages, not just references
  
	  if (!conversation) {
		console.log("No conversation found.");
		return res.status(200).json([]);
	  }
  
	  const messages = conversation.messages;
	  console.log("Messages found:", messages);
  
	  res.status(200).json(messages);
	} catch (error) {
	  console.error("Error in getMessages controller:", error.message);
	  res.status(500).json({ error: "Internal server error" });
	}
  };