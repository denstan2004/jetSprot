import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const createRequest = async (token: string,) => {
  const response = await axios.post(`${apiUrl}/moderation/verification/`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default createRequest;
