import axios from "axios";
import { apiUrl } from "../apiUrl";

import { Announcement } from "@/types/Announcement";

export const createAnnouncement = async (announcement: Announcement, token: string) => {
    const response = await axios.post(`${apiUrl}/announcement/`, announcement, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
    return response.data;
};
