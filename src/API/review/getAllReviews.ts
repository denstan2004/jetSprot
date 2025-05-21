import axios from "axios";
import { apiUrl } from "../apiUrl";

const getAllReviews = async () => {
  const response = await axios.get(`${apiUrl}/review/`);
  return response.data.results;
};

export default getAllReviews;
