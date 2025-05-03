import axios from "axios";
import { apiUrl } from "../apiUrl";

const getAllUsers = async () => {
  const response = await axios.get(`${apiUrl}/user/`);
  return response.data.results || [];
};

export default getAllUsers;
