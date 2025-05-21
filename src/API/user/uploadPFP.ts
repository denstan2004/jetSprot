import axios from "axios";
import { apiUrl } from "../apiUrl";

interface PostFotoData {
    pfp: string | null
  }

const uploadPFP = async (data: PostFotoData, token: string) => {
  const formData = new FormData();

  const mediaFile = {
    uri: data.pfp,
    type: "image/jpeg",
    name: "pfp.jpg",
  };
  formData.append("pfp", mediaFile as any);

  const response = await axios.post(`${apiUrl}/user/upload-pfp/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


export default uploadPFP;
