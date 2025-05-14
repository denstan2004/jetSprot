import axios from "axios";
import { apiUrl } from "../apiUrl";

const deletePublication = async (publicationId: string, token: string) => {
  console.log(token);
  try {
    const response = await axios.delete(
      `${apiUrl}/publication/${publicationId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("DELETE error:", error.response?.data || error.message);
    throw error;
  }
};

export default deletePublication;
