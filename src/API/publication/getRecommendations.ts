import axios from "axios";
import { apiUrl } from "../apiUrl";

const getRecommendations = async (accessToken: string) => {
  const response = await axios.get(`${apiUrl}/publication/recommendations/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export default getRecommendations;
