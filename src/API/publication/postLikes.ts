import axios from "axios";
import { apiUrl } from "../apiUrl";

const PostLike = async (pubId: string, token: string) => {
  const response = await axios.post(`${apiUrl}/publication/${pubId}/like/`, {}, {
    headers: {
        Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

export default PostLike;
