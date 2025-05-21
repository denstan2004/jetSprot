import axios from "axios";
import { apiUrl } from "../apiUrl";

const deleteComments = async (comentId: string, token: string) => {
  const response = await axios.delete(`${apiUrl}/comment/${comentId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export default deleteComments;
