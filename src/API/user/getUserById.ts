import axios from "axios";
import { apiUrl } from "../apiUrl";

const getUserById = async (userId: string) => {
  const response = await axios.get(`${apiUrl}/user/${userId}/`);

  return response.data;
};

export default getUserById;
