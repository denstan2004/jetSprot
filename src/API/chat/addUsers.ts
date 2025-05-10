import axios from "axios"
import { apiUrl } from "../apiUrl";

const addUsers = async (token: string, chatId: number, userIds: number[]) => {
  const response = await axios.post(`${apiUrl}/chatroom/8/add-users/`, {
    user_ids: userIds,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default addUsers;
