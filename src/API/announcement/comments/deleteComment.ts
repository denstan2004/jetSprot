import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const deleteComment = async (commentId: string, token: string) => {
  try {
    const response = await axios.delete(
      `${apiUrl}/announcement-comment/${commentId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default deleteComment;
