import axios from "axios";
import { apiUrl } from "../apiUrl";

const changeReview = async (token: string, reviewId: string, rating: number, description: string) => {
  const response = await axios.patch(
    `${apiUrl}/review/${reviewId}/`,
    {
      rating: rating,
      description: description,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default changeReview;
