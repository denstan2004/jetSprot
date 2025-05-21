import axios from "axios";
import { apiUrl } from "../apiUrl";

const CommentsLikes = async (commentId: string, token: string) => {
  const res = await axios.post(
    `${apiUrl}/comment/${commentId}/like/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export default CommentsLikes;
