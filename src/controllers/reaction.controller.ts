import prisma from "../config/database.js";
import { Request, Response } from "express";


export const createReaction = async(req:Request, res:Response):Promise<void> => {

    try {

        const {type} = req.body;

        const userId = req.user.id;
        const watchPartyId = req.params.watchPartyId;

        if (!userId || !watchPartyId) {
            res.status(400).json({message:"User must be authenticated, and WatchPartyId is required."})
        }

        const WatchParty = await prisma.watchParty.findUnique({
            where:{
                id: parseInt(watchPartyId)
            }
        })

        if (!WatchParty) {
            res.status(400).json({message:"WatchParty does not exists."})
            
        }

        const reactionCreated = await prisma.reaction.create ({

            data: {
                userId,
                watchPartyId: parseInt(watchPartyId),
                type
            }

        })

        res.status(201).json({message:"Reaction created successfully.", reaction: reactionCreated})
        
    } catch (error) {   

        console.log("Error while creating reaction")
        res.status(500).json({ error: "Internal server error" })
        
    }

}