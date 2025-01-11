import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
// Load environment variables from .env file
dotenv.config();
const app = express();
const prisma = new PrismaClient();
// Define the port from environment variables
const PORT = process.env.PORT || 8000; // Default to 8000 if not provided
// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
// Routes import
import userRouter from "./routes/user.route.js";
import watchpartyRouter from "./routes/watchparty.route.js";
import webcamRouter from "./routes/webcamslots.route.js";
import messageRouter from "./routes/chatmessages.route.js";
// Routes Declaration
app.use("/api/users", userRouter);
app.use("/api/watchparties", watchpartyRouter);
app.use("/api/webcamslots", webcamRouter);
app.use("/api/messages", messageRouter);
// Start the server
async function startServer() {
    try {
        // Connect to the database
        await prisma.$connect();
        console.log("Connected to Postgres!");
        // Start listening on the defined port
        app.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`);
        });
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit the process if DB connection fails
    }
}
startServer();
