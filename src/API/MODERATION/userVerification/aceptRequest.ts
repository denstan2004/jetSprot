import axios from "axios";
import { apiUrl } from "@/API/apiUrl";

const acceptRequest = async (token: string, Id: string) => {
  const response = await axios.post(
    `${apiUrl}/moderation/verification/${Id}/accept/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default acceptRequest;
