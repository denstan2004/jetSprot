import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const createReport = async (
  token: string,
  reported_user: number,
  category: string,
  description: string
) => {
  // console.log(reported_user, category, description);
  try {
    const response = await axios.post(
      `${apiUrl}/moderation/reports/`,
      {
        reported_user: reported_user,
        category: category,
        description: description,
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

export default createReport;
