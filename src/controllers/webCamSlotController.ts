import prisma from "../config/database.js";
import { Request, Response } from "express";

export const createWebcamSlot = async (req: Request, res: Response): Promise<void> => {
    const { watchPartyId, isActive, slotNumber } = req.body;

    try {

        // Extract userId from authentication middleware
        const userId = (req as any).user?.userId;

        if (!userId) {
            res.status(401).json({ message: "User must be authenticated." });
            return;
        }



        if (!watchPartyId || !slotNumber) {
            res.status(400).json({ message: "watchPartyId and slotNumber are required." });

        }

        // Ensure the user is the creator of the watch party
        const watchParty = await prisma.watchParty.findUnique({
            where: { id: watchPartyId },
        });


        if (!watchParty || watchParty.hostId !== userId) {
            res.status(403).json({ message: "You are not authorized to create slots for this watch party." });
            return;
          }


        const newSlot = await prisma.webcamSlot.create({
            data: {
                watchPartyId,
                isActive: isActive ?? false,
                slotNumber,
                userId
            }
        })


        res.status(201).json({ message: "WebcamSlot created successfully.", newSlot })


    } catch (error) {
        console.log("Error creating webcamslot ")
        res.status(500).json({ error: "Internal server error" })

    }

    //in postman, check with login user comes automatically in created webcamslots
    

}



