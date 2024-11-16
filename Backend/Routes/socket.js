import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://chat-app-yt.onrender.com"], // Allow these origins
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"], // Allow necessary headers
        credentials: true, // If you're using cookies or auth headers
    },
});

const userSocketMap = {}; // {userId: socketId}

// Helper function to get receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId; // Get userId from query
    if (userId !== "undefined" && userId) {
        userSocketMap[userId] = socket.id; // Map userId to socketId
    }

    // Emit the list of online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        if (userId) delete userSocketMap[userId]; // Remove user from map
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update online users
    });
});

export { app, io, server };
