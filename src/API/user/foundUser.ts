import axios from "axios";
import { apiUrl } from "../apiUrl";

const foundUser = async (
  keywords: string,
  token: string
) => {
  const response = await axios.get(
    `${apiUrl}/user/search/?keywords=${keywords}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default foundUser;
// ${apiUrl}/user/search/?keywords=${keywords}&rating=&age_min=27
