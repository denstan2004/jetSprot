import axios from "axios";
import { apiUrl } from "../apiUrl";

const unBanUser = async (token: string, userId: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/user/${userId}/unban/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to unban user:", error);
    throw error;
  }
};

export default unBanUser;
