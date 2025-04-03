import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";
dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8000;
const STREAM_ROOT_DIR = process.env.STREAM_DIR || './streams';
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
import userRouter from "./routes/user.route.js";
import watchpartyRouter from "./routes/watchparty.route.js";
import webcamRouter from "./routes/webcamslots.route.js";
import messageRouter from "./routes/chatmessages.route.js";
import reactionRouter from "./routes/reaction.route.js";
import playbacksyncRouter from "./routes/playbacksync.route.js";
import mediaRouter from "./routes/media.route.js";
import notificationRouter from "./routes/notification.route.js";
// Serve HLS stream files with appropriate headers
app.use('/streams', (req, res, next) => {
    const filePath = path.join(STREAM_ROOT_DIR, req.url);
    // Set CORS headers for video streaming
    res.header('Access-Control-Allow-Origin', '*');
    // Set content types for HLS streaming
    if (req.url.endsWith('.m3u8')) {
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    }
    else if (req.url.endsWith('.ts')) {
        res.setHeader('Content-Type', 'video/MP2T');
    }
    next();
}, express.static(STREAM_ROOT_DIR));
// Routes Declaration
app.use("/api/users", userRouter);
app.use("/api/watchparties", watchpartyRouter);
app.use("/api/webcamslots", webcamRouter);
app.use("/api/messages", messageRouter);
app.use("/api/reactions", reactionRouter);
app.use("/api/playbacksync", playbacksyncRouter);
app.use("/api/media", mediaRouter);
app.use("/api/notification", notificationRouter);
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
