import prisma from "../config/database.js";
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
                id: parseInt(id),
            },
        });
        if (!deleteWatchparty) {
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
