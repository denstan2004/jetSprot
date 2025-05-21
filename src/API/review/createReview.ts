import axios from "axios";
import { apiUrl } from "../apiUrl";

const createReview = async (
  token: string,
  reviewed_user: number,
  rating: number,
  description?: string
) => {
  const response = await axios.post(
    `${apiUrl}/review/`,
    {
      description,
      rating,
      reviewed_user,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default createReview;
