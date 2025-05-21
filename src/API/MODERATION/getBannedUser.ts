import axios from "axios";

import { apiUrl } from "../apiUrl";

const getBannedUser = async (token: string) => {
  try {
    const response = await axios.get(
      // `${apiUrl}/user/banned/?username=${username}&id=${id}`,
      `${apiUrl}/user/banned/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get banned user:", error);
    throw error;
  }
};

export default getBannedUser;
