import axios from "axios";
import { apiUrl } from "../apiUrl";

interface ChatResponseInterface {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatInterface[];
}
export interface ChatInterface {
  id: number;
  name: string;
  members: [
    {
      id: number;
      username: string;
      pfp_url: string;
    }
  ];
  last_message: {
    id: number;
    chat: number;
    sender: string;
    content: string;
    timestamp: string;
  };
  is_group: boolean;
  unread_count: number;
}

export const getAllChats = async (token: string): Promise<ChatInterface[]> => {
  const response = await axios.get<ChatResponseInterface>(
    `${apiUrl}/chatroom/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.results;
};
