import axios from "axios";

import { apiUrl } from "@/API/apiUrl";

const likeComment = async (commentId: string, token: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/announcement-comment/${commentId}/like/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("likeComment response:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default likeComment;
