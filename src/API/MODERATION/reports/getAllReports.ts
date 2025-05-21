import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const getAllReports = async (token: string) => {
  const response = await axios.get(`${apiUrl}/moderation/reports/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.results;
};

export default getAllReports;
