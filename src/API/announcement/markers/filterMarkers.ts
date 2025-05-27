import axios from "axios";
import { apiUrl } from "../../apiUrl";

const filterMarkers = async (token: string,country: string,city: number,user: number,sport: number) => {
  const response = await axios.get(`${apiUrl}/marker/filter/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};