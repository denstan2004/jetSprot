import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const acceptEventRequest = async (token: string, Id: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/moderation/permanent-event/${Id}/accept/`,
      {},
      {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default acceptEventRequest;
