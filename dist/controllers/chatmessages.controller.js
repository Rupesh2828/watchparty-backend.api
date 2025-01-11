import prisma from "../config/database.js";
export const createChatMessages = async (req, res) => {
    const userId = req.user?.userId;
    const { watchPartyId, message } = req.body;
    try {
        if (!userId || !watchPartyId) {
            res.status(400).json({ message: "UserId or WatchPartyId is required." });
        }
        // checking if the user is the creator of the watch party
        const watchParty = await prisma.watchParty.findUnique({
            where: { id: watchPartyId },
        });
        if (!watchParty) {
            res.status(400).json({ message: "WatchParty does not exists." });
        }
        const messageWithinWatchParty = await prisma.chatMessage.create({
            data: {
                watchPartyId,
                userId,
                message
            }
        });
        res.status(200).json({ message: "Message created successfully..", messageWithinWatchParty });
    }
    catch (error) {
        console.log("Error creating message ");
        res.status(500).json({ error: "Internal server error" });
    }
};
