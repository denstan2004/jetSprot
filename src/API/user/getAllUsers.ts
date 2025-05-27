import axios from "axios";
import { apiUrl } from "../apiUrl";

const getAllUsers = async (token: string) => {
  const response = await axios.get(`${apiUrl}/user/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.results || [];
};

export default getAllUsers;
