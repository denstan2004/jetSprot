import axios from "axios";
import { apiUrl } from "../apiUrl";

const patchCounty = async (
  userId: number,
  token: string,
  { city, country }: { city: string; country: string }
) => {
  try {
    const response = await axios.patch(
      `${apiUrl}/user/${userId}/`,
      {
        city,
        country,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default patchCounty;