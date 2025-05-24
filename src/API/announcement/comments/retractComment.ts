import axios from "axios";
import { apiUrl } from "@/API/apiUrl";

const retractComment = async (commentId: string, token: string) => {
  console.log("commentId:", commentId);
  try {
    const response = await axios.delete(
      `${apiUrl}/announcement-comment/${commentId}/retract-like/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("retractComment response:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default retractComment;
