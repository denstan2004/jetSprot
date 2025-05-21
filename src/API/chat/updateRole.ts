import axios from "axios"
import { apiUrl } from "../apiUrl"

const updateRole = async (role: string, chatroomId: string, userId: number, token: string) => {
  const response = await axios.patch(`${apiUrl}/chatroom/${chatroomId}/update-role/`, {
    user_id: userId,
    role: role,
  }, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return response.data;
};

export default updateRole;
