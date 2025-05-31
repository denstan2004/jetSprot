import axios from "axios";
import { apiUrl } from "../apiUrl";
import { Announcement } from "@/types/Announcement";
export const getAllAnouncements = async (accessToken: string) => {
  try {
    const response = await axios.get(
      `${apiUrl}/announcement/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data.results as Announcement[]);
    return response.data.results ;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
};