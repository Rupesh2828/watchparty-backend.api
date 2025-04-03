import prisma from "../config/database.js";
import { mkdirSync, existsSync } from 'fs';
import { spawn } from 'child_process';
import path from 'path';
const STREAM_ROOT_DIR = process.env.STREAM_DIR || './streams';
const HLS_SEGMENT_DURATION = 4; // in seconds
// Ensure streams directory exists
if (!existsSync(STREAM_ROOT_DIR)) {
    mkdirSync(STREAM_ROOT_DIR, { recursive: true });
}
export const createWatchParty = async (req, res) => {
    try {
        const { title, description, videoUrl, startTime, endTime } = req.body;
        const hostId = req.user?.userId;
        if (!hostId) {
            res.status(401).json({ message: "Host ID is required." });
            return;
        }
        if (!title || !description || !videoUrl) {
            res.status(401).json({ message: "Title, Description, Host and Video URL are required !!" });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: hostId }
        });
        if (!user) {
            res.status(401).json({ message: "Host User not found!!" });
            return;
        }
        const iswatchpartyExist = await prisma.watchParty.findFirst({
            where: {
                hostId: hostId,
                title: title
            }
        });
        if (iswatchpartyExist) {
            res.status(401).json({ message: "Watch Party already exists with the same title" });
            return;
        }
        const watchpartyCreation = await prisma.watchParty.create({
            data: {
                title,
                description,
                hostId,
                videoUrl,
                startTime: startTime ? new Date(startTime) : null,
                endTime: endTime ? new Date(endTime) : null,
            },
        });
        if (!watchpartyCreation) {
            res.status(401).json({ message: "Watchparty creation failed !!" });
            return;
        }
        res.status(201).json({ message: 'Watchparty created successfully', watchpartyCreation });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
};
export const getWatchPartyById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "ID id required" });
            return;
        }
        const watchParty = await prisma.watchParty.findUnique({
            where: { id: parseInt(id) },
            include: {
                host: true,
                participants: true
            }
        });
        if (!watchParty) {
            res.status(404).json({ message: "Watch party not found." });
            return;
        }
        res.status(200).json({ message: "Watch party retrieved successfully.", watchParty });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};
export const updateWatchpartyDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ message: "Valid Watch Party ID is required." });
            return;
        }
        if (!title || !description) {
            res.status(400).json({ message: "Title and Description are required." });
            return;
        }
        const updatedWatchparty = await prisma.watchParty.update({
            where: {
                id: parseInt(id),
            },
            data: {
                title,
                description,
            },
        });
        if (!updatedWatchparty) {
            res.status(400).json({ message: "Watch party update failed." });
            return;
        }
        res.status(200).json({
            message: "Watch party updated successfully.",
            updatedWatchparty,
        });
    }
    catch (error) {
        console.error("Error updating watch party:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const deleteWatchparty = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ message: "Valid Watch Party ID is required." });
            return;
        }
        //if id of specific watchparty is found. then proceed to delete it.
        const deletedWatchparty = await prisma.watchParty.delete({
            where: {
                id: parseInt(id)
            }
        });
        if (!deletedWatchparty) {
            res.status(400).json({ message: "Unable to delete watchparty." });
            return;
        }
        res.status(200).json({ message: "WatchParty deleted successfully.", deletedWatchparty: {} });
    }
    catch (error) {
        console.error("Error deleting watch party:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const addParticipantToWatchParty = async (req, res) => {
    try {
        const { id } = req.params;
        const participantsIds = req.body.participantsIds;
        console.log(participantsIds);
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ message: "Valid Watch Party ID is required." });
            return;
        }
        if (!participantsIds || !Array.isArray(participantsIds) || participantsIds.length === 0) {
            res.status(400).json({ message: "Participants IDs must be an array of user IDs." });
            return;
        }
        const watchPartyId = parseInt(id);
        //fetch the watchparty if its exists or not
        const watchParty = await prisma.watchParty.findUnique({
            where: { id: watchPartyId },
            include: { participants: true }
        });
        if (!watchParty) {
            res.status(404).json({ message: "Watch Party not found." });
            return;
        }
        const newParticipantsIds = participantsIds.filter((id) => {
            return !watchParty.participants.some((participant) => participant.id === id);
        });
        if (newParticipantsIds.length === 0) {
            res.status(400).json({ message: "All provided users are already participants of this watch party." });
            return;
        }
        //validating all given user ids exists
        const user = await prisma.user.findMany({
            where: {
                id: {
                    in: newParticipantsIds
                }
            }
        });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        //adding participant to watchparty
        const updatedWatchParty = await prisma.watchParty.update({
            where: { id: watchPartyId },
            data: {
                participants: {
                    connect: newParticipantsIds.map((id) => ({ id })),
                },
            },
            include: {
                // Include participants in the response
                participants: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        });
        if (!updatedWatchParty) {
            res.status(400).json({ message: "Unable to add participant to watchparty." });
            return;
        }
        res.status(200).json({ message: "Participant added to watchparty successfully.", watchParty: updatedWatchParty });
    }
    catch (error) {
        console.log("Error adding participant to watchparty");
        res.status(500).json({ error: "Internal server error" });
    }
};
export const removeParticipantFromWatchParty = async (req, res) => {
    try {
        const { id } = req.params;
        const participantsIds = req.body.participantsIds;
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ message: "Valid Watch Party ID is required." });
            return;
        }
        if (!participantsIds || !Array.isArray(participantsIds) || participantsIds.length === 0) {
            res.status(400).json({ message: "Participants IDs must be an array of user IDs." });
            return;
        }
        const watchPartyId = parseInt(id);
        //fetch the watchparty if its exists or not
        const watchParty = await prisma.watchParty.findUnique({
            where: { id: watchPartyId },
            include: { participants: true }
        });
        if (!watchParty) {
            res.status(404).json({ message: "Watch Party not found." });
            return;
        }
        const participantsToRemove = participantsIds.filter((id) => {
            return watchParty.participants.some((participant) => participant.id === id);
        });
        if (participantsToRemove.length === 0) {
            res.status(400).json({ message: "None of the provided users are participants of this watch party." });
            return;
        }
        //removing participant from watchparty
        const updatedWatchParty = await prisma.watchParty.update({
            where: { id: watchPartyId },
            data: {
                participants: {
                    disconnect: participantsToRemove.map((id) => ({ id })),
                },
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                } // Include participants in the response
            }
        });
        if (!updatedWatchParty) {
            res.status(400).json({ message: "Unable to remove participant from watchparty." });
            return;
        }
        res.status(200).json({ message: "Participant removed from watchparty successfully.", watchParty: updatedWatchParty });
    }
    catch (error) {
        console.log("Error removing participant from watchparty");
        res.status(500).json({ error: "Internal server error" });
    }
};
export const cleanupStream = async (watchPartyId) => {
    if (activeStreams.has(watchPartyId)) {
        activeStreams.delete(watchPartyId);
    }
};
const activeStreams = new Map();
export const startStreaming = async (req, res) => {
    try {
        const { videoUrl } = req.body;
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ message: "Valid Watch Party ID is required." });
            return;
        }
        if (!videoUrl) {
            res.status(400).json({ message: "Video URL is required" });
        }
        const watchPartyId = parseInt(id);
        const watchParty = await prisma.watchParty.findUnique({
            where: { id: watchPartyId },
            include: { participants: true }
        });
        if (!watchParty) {
            res.status(404).json({ message: "Watch Party not found." });
            return;
        }
        // checking if streaming is already active for this watch party
        if (activeStreams.has(watchPartyId)) {
            res.status(400).json({ message: "Streaming is already active for this watchparty" });
            return;
        }
        //this is for creating subdirectory for each watch party.
        const streamDir = path.join(STREAM_ROOT_DIR, watchPartyId.toString());
        if (!existsSync(streamDir)) {
            mkdirSync(streamDir, { recursive: true });
        }
        const outputPath = path.join(streamDir, 'stream.m3u8');
        // Set up FFmpeg command for HLS streaming
        const ffmpeg = spawn('ffmpeg', [
            '-i', videoUrl, // Input file
            '-c:v', 'libx264', // Video codec
            '-c:a', 'aac', // Audio codec
            '-b:v', '1M', // Video bitrate
            '-b:a', '128k', // Audio bitrate
            '-hls_time', HLS_SEGMENT_DURATION.toString(), // Segment duration
            '-hls_list_size', '10', // Number of segments in playlist
            '-hls_flags', 'delete_segments', // Delete old segments
            '-f', 'hls', // HLS format
            outputPath // Output file
        ]);
        // Handle FFmpeg process events
        ffmpeg.stderr.on('data', (data) => {
            console.log(`FFmpeg [${watchPartyId}]: ${data.toString()}`);
        });
        ffmpeg.on('error', (error) => {
            console.error(`FFmpeg error [${watchPartyId}]:`, error);
            cleanupStream(watchPartyId);
        });
        ffmpeg.on('exit', (code, signal) => {
            console.log(`FFmpeg process exited with code ${code} and signal ${signal}`);
            cleanupStream(watchPartyId);
        });
        // Store FFmpeg process reference
        activeStreams.set(watchPartyId, {
            process: ffmpeg,
            outputPath,
            streamDir
        });
        // Update watch party status
        await prisma.watchParty.update({
            where: { id: watchPartyId },
            data: {
                isLive: true,
                streamUrl: `/streams/${watchPartyId}/stream.m3u8`
            }
        });
        res.status(200).json({
            message: "Streaming started successfully",
            streamUrl: `/streams/${watchPartyId}/stream.m3u8`
        });
    }
    catch (error) {
        console.log("Error starting watchparty live");
        res.status(500).json({ error: "Internal server error" });
    }
};
export const endWatchPartyLive = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ message: "Valid Watch Party ID is required." });
            return;
        }
        const watchPartyId = parseInt(id);
        const watchParty = await prisma.watchParty.findUnique({
            where: { id: watchPartyId },
            include: { participants: true }
        });
        if (!watchParty) {
            res.status(404).json({ message: "Watch Party not found." });
            return;
        }
        const updatedWatchParty = await prisma.watchParty.update({
            where: { id: watchPartyId },
            data: {
                isLive: false
            }
        });
        if (!updatedWatchParty) {
            res.status(400).json({ message: "Unable to end watchparty live." });
            return;
        }
        res.status(200).json({
            message: "Watchparty ended live successfully.",
            watchParty: { ...updatedWatchParty, participants: watchParty.participants },
        });
    }
    catch (error) {
        console.log("Error ending watchparty live");
        res.status(500).json({ error: "Internal server error" });
    }
};
// export const createWebcamSlot = async (req: Request, res: Response): Promise<void> => {
//   try {
//       const { watchPartyId, isActive, slotNumber, userId } = req.body;
//       if (!watchPartyId || !slotNumber) {
//           res.status(400).json({ message: "watchPartyId and slotNumber are required." });
//         }
//       //checking if user exists or not
//       const existingUser = await prisma.user.findFirst({ where: { id: userId } })
//       if (!existingUser) {
//           res.status(400).json({ message: "User does not exists" })
//       }
//       const newSlot = await prisma.webcamSlot.create({
//           data: {
//               watchPartyId,
//               isActive,
//               slotNumber,
//               userId
//           }
//       })
//       if (!newSlot) {
//           res.status(400).json({ message: "WebCam slot creation failed" })
//       }
//       res.status(201).json({ message: "WebcamSlot created successfully.", newSlot })
//   } catch (error) {
//       console.log("Error creating webcamslot ")
//       res.status(500).json({ error: "Internal server error" })
//   }
// }
