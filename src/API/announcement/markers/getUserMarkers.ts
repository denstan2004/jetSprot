import axios from "axios";
import { apiUrl } from "../../apiUrl";

const getUserMarkers = async (token: string) => {
  const response = await axios.get(`${apiUrl}/marker/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};