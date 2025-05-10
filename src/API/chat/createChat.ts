import axios from "axios";
import { apiUrl } from "../apiUrl";

export const createChat = async (
  token: string,
  userIds: number[],
  isGroup: boolean
) => {
  const response = await axios.post(
    `${apiUrl}/chatroom/create-chat/`,
    { users: userIds, is_group: isGroup },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
