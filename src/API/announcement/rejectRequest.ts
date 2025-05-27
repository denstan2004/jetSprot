import axios from "axios";
import { apiUrl } from "../apiUrl";

const rejectRequest = async (announcementId: number, token: string) => {
  const response = await axios.post(`${apiUrl}/request/${announcementId}/reject/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default rejectRequest;