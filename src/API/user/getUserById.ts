import axios from "axios";
import { apiUrl } from "../apiUrl";

const getUserById = async (userId: string) => {
  const response = await axios.get(`${apiUrl}/user/${userId}/`);
  console.log(response.data);
  return response.data;
};

export default getUserById;
