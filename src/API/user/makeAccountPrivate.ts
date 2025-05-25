import axios from "axios";
import { apiUrl } from "../apiUrl";

const makeAccountPrivate = async (accessToken: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/user/make-private/`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default makeAccountPrivate;
