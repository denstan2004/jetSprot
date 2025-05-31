import axios from "axios";
import { apiUrl } from "../apiUrl";

export const createAnnouncementRequest = async (announcementId: number, token: string) => {
  const response = await axios.post(`${apiUrl}/request/`, {
    announcement: announcementId,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};