import axios from "axios";
import { apiUrl } from "../apiUrl";

const getChatroom = async (chatroomId: string, token: string) => {
  const response = await axios.get(`${apiUrl}/chatroom/${chatroomId}/`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return response.data;
};

export default getChatroom;
