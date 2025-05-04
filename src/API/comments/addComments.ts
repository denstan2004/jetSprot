import axios from "axios";
import { apiUrl } from "../apiUrl";

const addComments = async (comment: string, access: string, postId: number) => {
  const response = await axios.post(
    `${apiUrl}/comment/`,
    { content: comment, publication: postId },
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
  return response;
};

export default addComments;
