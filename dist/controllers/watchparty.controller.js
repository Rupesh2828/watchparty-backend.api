import prisma from "../config/database.js";
export const createWatchParty = async (req, res) => {
    try {
        const { title, description, hostId, videoUrl, startTime, endTime } = req.body;
        if (!title || !description || !hostId || !videoUrl) {
            res.status(401).json({ message: "Title, Description, Host and Video URL are required !!" });
        }
        const user = await prisma.user.findUnique({
            where: { id: hostId }
        });
        if (!user) {
            res.status(401).json({ message: "Host User not found!!" });
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
        }
        res.status(201).json({ message: 'Watchparty created successfully', watchpartyCreation });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
