import axios from "axios";
import { apiUrl } from "../apiUrl";

const userReviews = async (id: string) => {
  const response = await axios.get(`${apiUrl}/review/user/${id}/received/`);

  return response.data;
};

export default userReviews;
