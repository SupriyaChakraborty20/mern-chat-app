import mongoose from "mongoose";

// Hardcoded MongoDB URI
const MONGO_DB_URI = "mongodb+srv://supriyachak2003:EfNzaQflNaQqUrNH@cluster0.ptbyc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_DB_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

export default connectToMongoDB;
