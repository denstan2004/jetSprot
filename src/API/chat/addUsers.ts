import axios from "axios"
import { apiUrl } from "../apiUrl";

const addUsers = async (token: string, chatId: string, userIds: number[]) => {
  const response = await axios.post(`${apiUrl}/chatroom/${chatId}/add-users/`, {
    user_ids: userIds,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default addUsers;
