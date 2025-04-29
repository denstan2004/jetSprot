import axios from "axios";
import { apiUrl } from "../apiUrl";
export const deleteAnnouncement = async (id: number, token: string) => {
  const response = await axios.delete(`${apiUrl}/announcement/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};