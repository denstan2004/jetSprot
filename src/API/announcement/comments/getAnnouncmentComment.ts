import { apiUrl } from "@/API/apiUrl";
import { AnnouncementComment } from "@/types/AnnouncmentComment";
import axios from "axios";


const getAnnouncmentComment = async (announcementId: string) => {
  const response = await axios.get<AnnouncementComment[]>(
    `${apiUrl}/announcement/${announcementId}/comments/`
  );
  return response.data;
};

export default getAnnouncmentComment;
