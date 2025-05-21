import axios from "axios";
import { apiUrl } from "../apiUrl";

const CommRetractLikeLikes = async (commentId: string, token: string) => {
  const res = await axios.delete(`${apiUrl}/comment/${commentId}/like/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export default CommRetractLikeLikes;
