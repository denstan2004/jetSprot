import axios from "axios";
import { apiUrl } from "../apiUrl";

const foundUser = async (
  token: string,
  keywords?: string,
  rating?: number,
  age_min?: number,
) => {
  try {
    const params = new URLSearchParams();
    
    if (keywords) params.append('keywords', keywords);
    if (rating !== undefined) params.append('rating', rating.toString());
    if (age_min !== undefined) params.append('age_min', age_min.toString());

    const response = await axios.get(
      `${apiUrl}/user/search/?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error found user", error);
    throw error;
  }
};

export default foundUser;
// ${apiUrl}/user/search/?keywords=${keywords}&rating=&age_min=27
