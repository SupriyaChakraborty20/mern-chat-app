import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Hardcoded fallback secret if not available in .env
const DEFAULT_JWT_SECRET = "9tSg4+xIS+KErw1UW7RzPqNxbQCs9uyvYnB/E/db8Z4=";

const generateTokenAndSetCookie = (userId, res) => {
    // Use environment variable JWT_SECRET or fallback to hardcoded secret
    const secretKey = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

    try {
        // Sign the JWT
        const token = jwt.sign({ userId }, secretKey, {
            expiresIn: '15d'  // Token expiration of 15 days
        });

        // Set the JWT as a cookie
        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,  // 15 days in milliseconds
            httpOnly: true,  // Cookie is accessible only via HTTP (no JS)
            sameSite: "strict",  // Same site policy to prevent CSRF attacks
            // secure: process.env.NODE_ENV !== "development"  // Only over HTTPS in production
            secure: false,
        });

    } catch (error) {
        console.error("Error generating or signing JWT:", error);
        throw new Error("Failed to generate token.");
    }
};

export default generateTokenAndSetCookie;
