import axios from "axios";
import { apiUrl } from "../apiUrl";
import { User } from "@/types/User";

const getUserFollows = async (userId: number) => {
  try {
    const response = await axios.get<User[]>(
      `${apiUrl}/user/${userId}/follows/`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getUserFollows;
