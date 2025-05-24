import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const addComment = async (
  content: string,
  announcementId: number,
  token: string
) => {
  try {
    const response = await axios.post(
      `${apiUrl}/announcement-comment/`,
      {
        content: content,
        announcement: announcementId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default addComment;
