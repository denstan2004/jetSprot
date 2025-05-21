import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const getAllRequest = async (token: string) => {
  const response = await axios.get(`${apiUrl}/moderation/verification/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.results;
};

export default getAllRequest;
