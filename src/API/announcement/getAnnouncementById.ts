import axios from "axios";
import { apiUrl } from "../apiUrl";
import { Announcement } from "@/types/Announcement";
export const getAnnouncementById = async (id: number, token: string) => {
  const response = await axios.get<Announcement>(`${apiUrl}/announcement/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
