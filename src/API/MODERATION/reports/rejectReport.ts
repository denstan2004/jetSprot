import { apiUrl } from "@/API/apiUrl";

import axios from "axios";

const rejectReport = async (token: string, reportId: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/moderation/reports/${reportId}/reject/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to reject report:", error);
    throw error;
  }
};

export default rejectReport;
