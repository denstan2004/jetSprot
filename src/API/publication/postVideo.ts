import axios from "axios";
import { apiUrl } from "../apiUrl";

interface PostVideoData {
  caption: string;
  description: string;
  hashtags: string;
  media: string | null;
}

const postVideo = async (data: PostVideoData, acces: string) => {
  const formData = new FormData();

  formData.append("caption", data.caption);
  formData.append("description", data.description);
  formData.append("hashtags", data.hashtags);

  const mediaFile = {
    uri: data.media,
    type: "video/mp4",
    name: "media.mp4",
  };

  formData.append("media", mediaFile as any);

  const response = await axios.post(`${apiUrl}/publication/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${acces}`,
    },
  });
  return response.data;
};
export default postVideo;
