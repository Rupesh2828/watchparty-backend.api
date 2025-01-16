import prisma from "../config/database.js";
import { Request, Response } from "express";

export const createPlaybackSync = async (req: Request, res: Response): Promise<void> => {

    try {

        // create a new playback sync entry for a watch party.give according to PlaybackSync model

        const userId: number = (req as any).user?.userId;

        const watchPartyId = req.params.watchPartyId;

        const { currentTime, isPaused, volume, mediaId } = req.body;

        if (!userId || !watchPartyId) {
            console.log(userId, watchPartyId)
            res.status(400).json({ message: "User must be authenticated, and WatchPartyId is required." })

        }

        if (currentTime === undefined || isPaused === undefined || volume === undefined || !mediaId) {
            res.status(400).json({ message: "Missing required playback data (currentTime, isPaused, volume, mediaId)." });
        }

        const WatchParty = await prisma.watchParty.findUnique({
            where: {
                id: parseInt(watchPartyId)
            }
        })

        if (!WatchParty) {
            res.status(400).json({ message: "WatchParty does not exists." })
            return;

        }

        const createPlaybackSync = await prisma.playbackSync.create({
            data: {
                user: { connect: { id: userId } },  //link to existing user
                watchParty: { connect: { id: parseInt(watchPartyId) } },  //link to existing watchparty
                currentTime,
                isPaused,
                volume,
                media: { connect: { id: parseInt(mediaId) } }


            }
        })


        res.status(200).json({ message: "PlaybackSync created successfully", playBackSync: createPlaybackSync })


    } catch (error) {
        console.log("Error while creating playbackSync.", error)
        res.status(500).json({ error: "Internal server error" })

    }

}