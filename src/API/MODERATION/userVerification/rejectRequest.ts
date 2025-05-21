import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const rejectRequest = async (token: string, userId: string) => {
  const response = await axios.post(
    `${apiUrl}/moderation/verification/${userId}/reject/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default rejectRequest;
