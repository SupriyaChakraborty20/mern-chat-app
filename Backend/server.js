import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from "./Routes/message.routes.js";
import userRoutes from "./Routes/user.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./Routes/socket.js"; // Assuming both `app` and `server` are correctly exported

// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "https://chat-app-yt.onrender.com"], // Add allowed origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Add allowed methods
    credentials: true, // Enable cookies and authentication headers
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    // Connect to the MongoDB database
    await connectToMongoDB();
    console.log("Connected to MongoDB");

    // Start the server using Socket.IO's `server` instance
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Start the server
startServer();

