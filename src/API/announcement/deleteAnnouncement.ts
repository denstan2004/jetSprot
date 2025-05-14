import axios from "axios";
import { apiUrl } from "../apiUrl";
export const deleteAnnouncement = async (id: number, token: string) => {
  try {
    const response = await axios.delete(`${apiUrl}/announcement/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("DELETE error:", error.response?.data || error.message);
    throw error;
  }
};
