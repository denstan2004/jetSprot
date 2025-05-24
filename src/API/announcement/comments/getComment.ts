import { apiUrl } from "@/API/apiUrl";
import axios from "axios";
import { AnnouncementComment } from "@/types/AnnouncmentComment";
const getComment = async (announcementId: string) => {
  try {
    const response = await axios.get<AnnouncementComment[]>(
      `${apiUrl}/announcement-comment/${announcementId}/`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching comments", error);
  }
};

export default getComment;
