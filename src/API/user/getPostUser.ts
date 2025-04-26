import { Post } from "@/types/Post";
import axios from "axios";

export const getPostUser = async (userId: string) => {
  try {
    const response = await axios.get<Post>(
      `http://127.0.0.1:8000/api/user/${userId}/publications/`
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
