import axios from "axios";
import { apiUrl } from "../apiUrl";

export interface RequestType {
  id: number;
  announcement: number;
  user: number;
  status: string;
}
export const getAllRequests = async (token: string) => {
  const response = await axios.get(`${apiUrl}/request/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};