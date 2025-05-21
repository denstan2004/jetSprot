import axios from "axios";
import { apiUrl } from "../apiUrl";

const RetractLike = async (pubId: string, token: string) => {
  const response = await axios.delete(`${apiUrl}/publication/${pubId}/retract-like/`, {
    headers: {
        Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

export default RetractLike;
