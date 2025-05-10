import axios from "axios";
import { apiUrl } from "../apiUrl";

const patchSport = async (sportId: string, sportName: string, token: string) => {
  const response = await axios.patch(`${apiUrl}/sport/${sportId}/`, {
    name: sportName,

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default patchSport;
