import axios from "axios";
import { apiUrl } from "../apiUrl";

const removeUsers = async (chatroomId: string, userId: number, token: string) => {
  const response = await axios.post(
    `${apiUrl}/chatroom/${chatroomId}/remove-user/`,
    {
      user_id: userId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default removeUsers;
