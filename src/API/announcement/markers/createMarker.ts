import axios from "axios";
import { apiUrl } from "./../../apiUrl";

interface CreateMarkerData {
  latitude: string;
  longitude: string;
  country: string;
  city: string;
  announcement: number;
}

export const createMarker = async (data: CreateMarkerData, token: string) => {
  try {
    console.log(apiUrl+"/marker");
    const response = await axios.post(`${apiUrl}/marker/`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating marker:", error);
    throw error; // Re-throw the error to handle it in the component
  }
};
