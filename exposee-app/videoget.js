
import { Video } from "./models/video.js";

async function getCurrentVideoId(userId) {
    try {
        const video = await Video.findOne({
            where: {
                user_id: userId,
                is_live: true,
            },
            order: [["createdAt", "DESC"]],
        });

        if (video) {
            return video.id;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error retrieving current video ID:", error);
        throw error;
    }
}

export { getCurrentVideoId };
