import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {
    try {
      // Check for the token in cookies or Authorization header
      const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
      console.log("Token received:", token);
  
      if (!token) {
        console.log("No token provided");
        return res.status(401).json({ error: "Unauthorized - No token provided" });
      }
  
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
  
      if (!decoded) {
        console.log("Invalid token");
        return res.status(401).json({ error: "Unauthorized - Invalid token" });
      }
  
      // Fetch user based on decoded token
      const user = await User.findById(decoded.userId).select("-password");
      console.log("User found:", user);
  
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ error: "User not found" });
      }
  
      // Attach the user object to the request for the next middleware or route handler
      req.user = user;
      console.log("User attached to request:", req.user);
  
      // Proceed to the next middleware
      next();
    } catch (error) {
      // Handle token expiration specifically
      if (error.name === 'TokenExpiredError') {
        console.log("Token expired");
        return res.status(401).json({ error: "Unauthorized - Token expired" });
      }
  
      console.error("Error in protectRoute middleware: ", error); // Log the entire error
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

export default protectRoute;
