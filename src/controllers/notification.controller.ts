import prisma from "../config/database.js";
import { Request, Response } from "express";

export const notifyWatchPartyStart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = (req as any).user?.userId;
    const { watchPartyId } = req.params;  // This is the ID of the watch party (e.g., 7)

    console.log("Fetching Watch Party with ID:", watchPartyId);

    // Fetch the Watch Party and its participants (excluding the host)
    const watchParty = await prisma.watchParty.findUnique({
      where: { id: parseInt(watchPartyId) },
      include: {
        participants: true,  // Includes all participants in the watch party
        host: true,  // Includes the host (creator of the watch party)
      },
    });

    if (!watchParty) {
      res.status(404).json({ message: "Watch party not found" });
      return;
    }

    // Check if the user is part of the watch party (host should not receive notification)
    const notifications = watchParty.participants
      .filter((participant) => participant.id !== watchParty.hostId) // Exclude host
      .map((participant) => ({
        userId: participant.id,  // Notify the participants
        watchPartyId: watchParty.id,  // Include the watch party ID
        content: `The watch party "${watchParty.title}" has started! Join now.`,
      }));

    if (notifications.length === 0) {
      res.status(200).json({ message: "No participants to notify." });
      return;
    }

    console.log("Notifications to be created:", notifications);

    // Create notifications for participants
    await prisma.notification.createMany({ data: notifications });

    res.status(201).json({ message: "Notifications sent to all participants" });
  } catch (error) {
    console.error("Error creating notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = (req as any).user?.userId;

    console.log("Fetching notifications for user ID:", userId);

    if (!userId) {
      res.status(400).json({ message: "User must be authenticated." });
      return;
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    console.log("Notifications found:", notifications);

    // If no notifications are found for the user
    if (notifications.length === 0) {
      res.status(200).json({ message: "No notifications found for this user." });
      return;
    }

    res.status(200).json({ notifications });

  } catch (error) {
    console.log("Error while fetching notifications for user", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = (req as any).user?.userId;
    const { notificationId } = req.params;

    console.log("Marking notification as read for user ID:", userId);

    if (!userId || !notificationId) {
      res.status(400).json({ message: "User must be authenticated, and notification ID is required." });
      return;
    }

    const notification = await prisma.notification.update({
      where: { id: parseInt(notificationId) },
      data: { isRead: true },
    });

    console.log("Notification marked as read:", notification);

    res.status(200).json({ message: "Notification marked as read." });

  } catch (error) {
    console.log("Error while marking notification as read", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {

  try {

    const userId: number = (req as any).user?.userId;
    const { notificationId } = req.params;

    if (!userId || !notificationId) {
      res.status(400).json({ message: "User must be authenticated, and notification ID is required." });
      return;
    }

    const deletedNotification = await prisma.notification.delete({
      where: {
        id: parseInt(notificationId)
      }
    })

    if (!deletedNotification) {
      res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
    


  } catch (error) {
    console.log("Error while marking notification as read", error);
    res.status(500).json({ error: "Internal server error" });

  }

}

export const getUnreadNotifications = async (req: Request, res: Response): Promise<void> => {


     try {

      const userId: number = (req as any).user?.userId;

      if (!userId) {
        res.status(400).json({ message: "User must be authenticated." });
        return;
      }

      const unreadNotifications = await prisma.notification.findMany({
        where: { userId, isRead: false },
        orderBy: { createdAt: "desc" },
      });

      if (unreadNotifications.length === 0) {
        res.status(200).json({ message: "No unread notifications found for this user." });
        return;
      }

      res.status(200).json({ unreadNotifications });
       
      
     } catch (error) {
      console.log("Error while fetching notifications for user", error);
      res.status(500).json({ error: "Internal server error" });
      
     }


}