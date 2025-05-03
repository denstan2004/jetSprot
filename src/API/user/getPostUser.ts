import { Post } from "@/types/Post";
import axios from "axios";
import { apiUrl } from "../apiUrl";

interface MarkerRequestInterface {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

export const getUserPosts = async (userId: string) => {
  try {
    const response = await axios.get<Post[]>(
      `${apiUrl}/user/${userId}/publications/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
};
