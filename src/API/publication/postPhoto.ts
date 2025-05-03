import axios from "axios";
import { apiUrl } from "../apiUrl";

interface PostFotoData {
  caption: string;
  description: string;
  hashtags: string;
  media: string | null;
}

const postFoto = async (data: PostFotoData, token: string) => {
  const formData = new FormData();

  formData.append("caption", data.caption);
  formData.append("description", data.description);
  formData.append("hashtags", data.hashtags);

  const mediaFile = {
    uri: data.media,
    type: "image/jpeg",
    name: "media.jpg",
  };
  formData.append("media", mediaFile as any);

  const response = await axios.post(`${apiUrl}/publication/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default postFoto;
