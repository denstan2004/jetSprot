import axios from "axios";
import { apiUrl } from "../apiUrl";

export interface RequestType {
  id: number;
  announcement: number;
  user: number;
  status: 0 | 1 | 2 | 4 | null;
}
export const getAllRequests = async (token: string) => {
  const response = await axios.get(`${apiUrl}/request/incoming-requests/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("requests", response.data);
  return response.data;
};