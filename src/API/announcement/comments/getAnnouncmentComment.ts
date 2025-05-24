import { apiUrl } from "@/API/apiUrl";
import { AnnouncementComment } from "@/types/AnnouncmentComment";
import axios from "axios";


const getAnnouncmentComment = async (announcementId: string, token: string) => {
  const response = await axios.get<AnnouncementComment[]>(
    `${apiUrl}/announcement/${announcementId}/comments/`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default getAnnouncmentComment;
