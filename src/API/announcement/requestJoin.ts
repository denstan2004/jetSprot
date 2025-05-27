import axios from "axios";
import { apiUrl } from "../apiUrl";

const requestJoin = async (announcement: number, token: string) => {
  const response = await axios.post(`${apiUrl}/request/`, {
    announcement,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default requestJoin;