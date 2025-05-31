import axios from "axios";
import { apiUrl } from "../../apiUrl";

export const getUserMarkers = async (token: string) => {
  const response = await axios.get(`${apiUrl}/marker/my_markers/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};