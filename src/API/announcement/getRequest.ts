import axios from "axios";
import { apiUrl } from "../apiUrl";

const getRequest = async (announcement: number, token: string) => {
  const response = await axios.get(`${apiUrl}/request/${announcement}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};