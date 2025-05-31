import axios from "axios";
import { apiUrl } from "../apiUrl";

export const getMyRequests = async (token: string) => {
  const response = await axios.get(`${apiUrl}/request/my_requests/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};