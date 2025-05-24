import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const getAllComment = async () => {
  try {
    const response = await axios.get(`${apiUrl}/announcement-comment/`);
    return response.data.results;
  } catch (error) {
    console.log(error);
  }
};

export default getAllComment;
