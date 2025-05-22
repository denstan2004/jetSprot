import axios from "axios";
import { apiUrl } from "../apiUrl";

import { Announcement } from "@/types/Announcement";
export interface CreateAnnouncementData {
    sport_ids: number[];
    caption: string;
    start_date: string;
    end_date: string;
    event_type:EventType;
    required_amount: number;
    status: number;
    description: string;
}
export enum EventType  {
    playerSearch = 0,
    announcement = 1,
    permanent = 2,
} 
export const createAnnouncement = async (announcement: CreateAnnouncementData, token: string) => {
    const response = await axios.post(`${apiUrl}/announcement/`, announcement, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
    return response.data;
};
