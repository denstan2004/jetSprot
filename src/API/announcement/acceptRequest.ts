import axios from "axios";
import { apiUrl } from "../apiUrl";

const acceptRequest = async (announcementId: number, token: string) => {
  const response = await axios.post(`${apiUrl}/request/${announcementId}/accept/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default acceptRequest;