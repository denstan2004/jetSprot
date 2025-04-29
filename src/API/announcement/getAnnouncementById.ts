import axios from "axios";
import { apiUrl } from "../apiUrl";
import { Announcement } from "@/types/Announcement";
export const getAnnouncementById = async (id: number) => {
  const response = await axios.get<Announcement>(`${apiUrl}/announcement/${id}`);
  return response.data;
};
