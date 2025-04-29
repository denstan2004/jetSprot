import axios from "axios";
import { apiUrl } from "../apiUrl";

import { Announcement } from "@/types/Announcement";
export interface CreateAnnouncementData {
    sports: string[];
    caption: string;
    description: string;
    valid_until: string;
    required_amount: number;
    creator: number;
    status: number;
}

export const createAnnouncement = async (announcement: CreateAnnouncementData, token: string) => {
    const response = await axios.post(`${apiUrl}/announcement/`, announcement, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
    return response.data;
};
