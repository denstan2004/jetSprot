import { User } from "@/types/User";
import axios from "axios";
import { apiUrl } from "../apiUrl";

const getUserFollowers = async (userId: number) => {
  try {
    const data = await axios.get<User[]>(`${apiUrl}/user/${userId}/followers/`);
    return data.data;
  } catch (err) {
    console.log(err);
    return [];
  }
};
export default getUserFollowers;
