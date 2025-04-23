import { User } from "@/types/User";
import axios from "axios";

const getUserFollowers = async (userId: string) => {
  try {
    const response = await axios.get<User[]>(
      `http://192.168.0.105:8000/api/user/${userId}/follows/`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getUserFollowers;
