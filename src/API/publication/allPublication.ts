import axios from "axios";
import { apiUrl } from "../apiUrl";
import { Post } from "@/types/Post";

interface PublicationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

const allPublication = async (): Promise<Post[]> => {
  try {
    const response = await axios.get<PublicationResponse>(
      `${apiUrl}/publication/`
    );
    return response.data.results || [];
  } catch (err) {
    console.error("Error fetching publications:", err);
    return [];
  }
};

export default allPublication;
