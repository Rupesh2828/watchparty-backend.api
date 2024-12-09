import prisma from "../config/database.js";
export const createWatchParty = async (req, res) => {
    try {
        const { title, description, hostId, videoUrl, startTime, endTime } = req.body;
        console.log(req.body);
        if (!title || !description || !hostId) {
            res.status(401).json({ message: "Title, Description and Host are required !!" });
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
        res.status(201).json({ message: 'watchparty created successfully', watchpartyCreation });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
