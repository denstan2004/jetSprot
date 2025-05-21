import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const approveReport = async (token: string, reportId: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/moderation/reports/${reportId}/approve/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to approve report:", error);
    throw error;
  }
};

export default approveReport;
