import axios from "axios";
import { apiUrl } from "../apiUrl";

const deleteReview = async (reviewId: string, token: string) => {
  try {
    const response = await axios.delete(`${apiUrl}/review/${reviewId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete review", error);
    throw error;
  }
};

export default deleteReview;
