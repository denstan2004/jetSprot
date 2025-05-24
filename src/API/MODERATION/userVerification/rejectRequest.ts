import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const rejectRequest = async (token: string, Id: string) => {
  const response = await axios.post(
    `${apiUrl}/moderation/verification/${Id}/reject/`,
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
