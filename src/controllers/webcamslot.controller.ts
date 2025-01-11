import prisma from "../config/database.js";
import { Request, Response } from "express";

export const createWebcamSlot = async (req: Request, res: Response): Promise<void> => {
    const { watchPartyId, isActive, slotNumber } = req.body;

    try {

        // extracting userId from authentication middleware
        const userId = (req as any).user?.userId;

        if (!userId) {
            res.status(401).json({ message: "User must be authenticated." });
            return;
        }



        if (!watchPartyId || !slotNumber) {
            res.status(400).json({ message: "watchPartyId and slotNumber are required." });

        }

        // checking if the user is the creator of the watch party
        const watchParty = await prisma.watchParty.findUnique({
            where: { id: watchPartyId },
        });


        if (!watchParty || watchParty.hostId !== userId) {
            res.status(403).json({ message: "You are not authorized to create slots for this watch party." });
            return;
        }

        //as here no webcamslot should be assign double to a user

        const slotExists = await prisma.webcamSlot.findFirst({
            where: {
                watchPartyId,
                slotNumber,
                userId: { not: null }
            }
        })

        if (slotExists) {
            res.status(400).json({ message: "This slot is already assigned to a user." });
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


}

export const getWebcamSlotById = async (req: Request, res: Response): Promise<void> => {

    try {

        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: "id is required." })

        }

        const webcamslots = await prisma.webcamSlot.findUnique(
            {
                where: { id: parseInt(id) }
            },
        )

        if (!webcamslots) {
            res.status(400).json({ message: "Unable to fetch webcamslots." })
        }

        res.status(201).json({ message: "WebCamSlot fetched successfully.", webcamslots })

    } catch (error) {

    }
}

export const getAllWebcamSlots = async (req: Request, res: Response): Promise<void> => {

    try {

        const { watchPartyId, userId } = req.params;

        const whereClause: any = {}

        if (watchPartyId) whereClause.watchPartyId = parseInt(watchPartyId);

        if (userId) whereClause.userId = parseInt(userId);

        const webcamSlots = await prisma.webcamSlot.findMany({
            where: whereClause,
        });

        if (!webcamSlots || webcamSlots.length === 0) {
            res.status(404).json({ message: "No webcam slots found." });
            return;
        }

        res.status(200).json({ message: "Webcam slots fetched successfully.", webcamSlots });


    } catch (error) {
        console.error("Error fetching webcam slots:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}

export const updateWebcamSlot = async( req: Request, res: Response): Promise<void> => {
    
    const { id } = req.params;
    const { isActive } = req.body;

    try {

        if (!id) {
            res.status(400).json({ message: "id is required." });
            return;
        }

        const webcamSlot = await prisma.webcamSlot.findUnique({
            where: { id: parseInt(id) }
        });

        if (!webcamSlot) {
            res.status(404).json({ message: "Webcam slot not found." });
            return;
        }

        const updatedSlot = await prisma.webcamSlot.update({
            where: { id: parseInt(id) },
            data: { isActive: isActive ?? webcamSlot.isActive }
        });

        res.status(200).json({ message: "Webcam slot updated successfully.", updatedSlot });

    } catch (error) {
        console.error("Error updating webcam slot:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}

export const deleteWebcamSlot = async (req: Request, res: Response): Promise<void> => {
 
    const { id } = req.params;

    try {

        if (!id) {
            res.status(400).json({ message: "id is required." });
            return;
        }

        const webcamSlot = await prisma.webcamSlot.findUnique({
            where: { id: parseInt(id) }
        });

        if (!webcamSlot) {
            res.status(404).json({ message: "Webcam slot not found." });
            return;
        }

        await prisma.webcamSlot.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: "Webcam slot deleted successfully." });

    } catch (error) {
        console.error("Error deleting webcam slot:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}

export const assignWebcamSlot = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { userId } = req.body;

    try {

        if (!id || !userId) {
            res.status(400).json({ message: "id and userId are required." });
            return;
        }

        const webcamSlot = await prisma.webcamSlot.findUnique({
            where: { id: parseInt(id) }
        });

        if (!webcamSlot) {
            res.status(404).json({ message: "Webcam slot not found." });
            return;
        }

        const updatedSlot = await prisma.webcamSlot.update({
            where: { id: parseInt(id) },
            data: { userId: parseInt(userId) }
        });

        res.status(200).json({ message: "Webcam slot assigned successfully.", updatedSlot });

    } catch (error) {
        console.error("Error assigning webcam slot:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}

export const unassignWebcamSlot = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {

        if (!id) {
            res.status(400).json({ message: "id is required." });
            return;
        }

        const webcamSlot = await prisma.webcamSlot.findUnique({
            where: { id: parseInt(id) }
        });

        if (!webcamSlot) {
            res.status(404).json({ message: "Webcam slot not found." });
            return;
        }

        const updatedSlot = await prisma.webcamSlot.update({
            where: { id: parseInt(id) },
            data: { userId: null }
        });

        res.status(200).json({ message: "Webcam slot unassigned successfully.", updatedSlot });

    } catch (error) {
        console.error("Error unassigning webcam slot:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


