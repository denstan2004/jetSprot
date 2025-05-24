import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const getAllEventRequest = async (token: string) => {
  const response = await axios.get(`${apiUrl}/moderation/permanent-event/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.results;
};

export default getAllEventRequest;
