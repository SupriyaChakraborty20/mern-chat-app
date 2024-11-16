import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

// SIGNUP CONTROLLER
export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    console.log("Received signup request:", { fullName, username, gender });

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return res.status(400).json({ error: "Passwords don't match" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
      console.log("Username already exists");
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed successfully");

    // Assign a profile picture based on gender
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    const profilePic = gender === "male" ? boyProfilePic : girlProfilePic;

    console.log("Profile picture URL:", profilePic);

    // Create a new user
    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic,
    });

    // Save the user and generate a token
    await newUser.save();
    console.log("New user saved to database");

    generateTokenAndSetCookie(newUser._id, res);
    console.log("Token generated and set in cookie");

    // Send response to the client
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    if (error.name === 'MongoNetworkTimeoutError') {
      console.error("MongoDB Timeout Error:", error.message);
      res.status(503).json({ error: "Service unavailable. Please try again later." });
    } else {
      console.error("Error in signup controller:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Received login request:", { username });

    // Find the user by username
    const user = await User.findOne({ username }).exec();
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log("Password incorrect");
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(user._id, res);
    console.log("Token generated and set in cookie");

    // Send the response with user details (without password)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
      
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    console.log("Received logout request");

    // Clear the JWT cookie by setting an expired cookie
    res.cookie("jwt", "", {
      httpOnly: true,
      // secure: true, // Ensure this is properly set based on your environment
      secure: false,
      maxAge: 0, // Set cookie expiration to 0
    });

    console.log("JWT cookie cleared");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};