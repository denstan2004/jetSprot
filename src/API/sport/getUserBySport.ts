import axios from "axios";
import { apiUrl } from "../apiUrl";

const searchUserBySports = async (sportId: string) => {
  const response = await axios.get(
    `${apiUrl}/sport/find-users/?sport=${sportId}`
  );

  return response.data;
};

export default searchUserBySports;
