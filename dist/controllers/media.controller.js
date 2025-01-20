import prisma from "../config/database.js";
export const createMedia = async (req, res) => {
    try {
        // create a new media entry for a watch party.give according to Media model
        const userId = req.user?.userId;
        const watchPartyId = req.params.watchPartyId;
        const { mediaUrl, mediaType, mediaTitle, mediaDescription } = req.body;
        if (!userId || !watchPartyId) {
            console.log(userId, watchPartyId);
            res.status(400).json({ message: "User must be authenticated, and WatchPartyId is required." });
        }
        if (!mediaUrl || !mediaType || !mediaTitle || !mediaDescription) {
            res.status(400).json({ message: "Missing required media data (mediaUrl, mediaType, mediaTitle, mediaDescription)." });
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
        const createMedia = await prisma.media.create({
            data: {
                user: { connect: { id: userId } }, //link to existing user
                watchParty: { connect: { id: parseInt(watchPartyId) } }, //link to existing watchparty
                mediaUrl,
                mediaType,
                mediaTitle,
                mediaDescription
            }
        });
        res.status(200).json({ message: "Media created successfully", media: createMedia });
    }
    catch (error) {
    }
};
