import { Post } from "@/types/Post";
import axios from "axios";

interface MarkerRequestInterface {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

export const getPostUser = async (userId: string) => {
  try {
    const response = await axios.get<Post>(
      `http://127.0.0.1:8000/api/user/${userId}/publications/`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
  }
};
