import axios from "axios";
import { apiUrl } from "../apiUrl";

const usersSporst = async (userId: string) => {
  const response = await axios.get(
    `${apiUrl}/sport/user-sports/?user=${userId}`
  );

  return response.data;
};

export default usersSporst;
