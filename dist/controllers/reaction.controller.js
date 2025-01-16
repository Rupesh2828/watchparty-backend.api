import prisma from "../config/database.js";
export const createReaction = async (req, res) => {
    try {
        const { type } = req.body;
        const userId = req.user?.userId;
        const watchPartyId = req.params?.watchPartyId;
        if (!userId || !watchPartyId) {
            console.log(userId, watchPartyId);
            res.status(400).json({ message: "User must be authenticated, and WatchPartyId is required." });
            return;
        }
        const WatchParty = await prisma.watchParty.findUnique({
            where: {
                id: parseInt(watchPartyId)
            }
        });
        if (!WatchParty) {
            res.status(400).json({ message: "WatchParty does not exists." });
            return;
        }
        const reactionCreated = await prisma.reaction.create({
            data: {
                userId: userId,
                watchPartyId: parseInt(watchPartyId),
                type
            }
        });
        res.status(201).json({ message: "Reaction created successfully.", reaction: reactionCreated });
        return;
    }
    catch (error) {
        console.log("Error while creating reaction");
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};
export const getAllReactions = async (req, res) => {
    try {
        const watchPartyId = req.params?.watchPartyId;
        if (!watchPartyId) {
            res.status(400).json({ message: "WatchPartyId is required." });
            return;
        }
        const WatchParty = await prisma.watchParty.findUnique({
            where: {
                id: parseInt(watchPartyId)
            }
        });
        if (!WatchParty) {
            res.status(400).json({ message: "WatchParty does not exists." });
            return;
        }
        const reactions = await prisma.reaction.findMany({
            where: {
                watchPartyId: parseInt(watchPartyId)
            }
        });
        res.status(200).json({ reactions });
        return;
    }
    catch (error) {
        console.log("Error while creating reaction");
        res.status(500).json({ error: "Internal server error" });
    }
};
export const deleteReaction = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const watchPartyId = req.params?.watchPartyId;
        if (!userId || !watchPartyId) {
            res.status(400).json({ message: "User must be authenticated, and WatchPartyId is required." });
            return;
        }
        const WatchParty = await prisma.watchParty.findUnique({
            where: {
                id: parseInt(watchPartyId)
            }
        });
        if (!WatchParty) {
            res.status(400).json({ message: "WatchParty does not exists." });
            return;
        }
        const reaction = await prisma.reaction.findFirst({
            where: {
                userId: userId,
                watchPartyId: parseInt(watchPartyId)
            }
        });
        if (!reaction) {
            res.status(400).json({ message: "Reaction does not exists." });
            return;
        }
        await prisma.reaction.delete({
            where: {
                id: reaction.id
            }
        });
        res.status(200).json({ message: "Reaction deleted successfully." });
        return;
    }
    catch (error) {
        console.log("Error while creating reaction");
        res.status(500).json({ error: "Internal server error" });
    }
};
