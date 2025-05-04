import axios from "axios";
import { apiUrl } from "../apiUrl";

const getComments = async () => {
  const response = await axios.get(`${apiUrl}/comment/`);
  return response.data;
};

export default getComments;
