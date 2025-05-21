import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const follow = async (token: string, userId: string) => {
    const response = await axios.post(`${apiUrl}/user/${userId}/follow/`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
    })
    return response.data;
};
export default follow;

// http://127.0.0.1:8000/api/user/3/follow/