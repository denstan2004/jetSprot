import axios from "axios";
import { apiUrl } from "../apiUrl";

const getComments = async (postId: string) => {
  const response = await axios.get(`${apiUrl}/publication/${postId}/comments/`);
  return response;
};

export default getComments;
