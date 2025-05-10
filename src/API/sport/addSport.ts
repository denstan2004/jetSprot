import axios from "axios";
import { apiUrl } from "../apiUrl";

const addSport = async (userId: string, sportId: number, token: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/user/${userId}/sports/`,
      {
        sport: sportId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error status:", error.response?.status);
    }
    throw error;
  }
};

export default addSport;
