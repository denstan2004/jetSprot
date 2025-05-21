import { apiUrl } from "@/API/apiUrl";
import axios from "axios";

const unFollow = async (token: string, userId: string) => {
    const response = await axios.delete(`${apiUrl}/user/${userId}/unfollow/`, {
        headers: {
            Authorization: `Bearer ${token}`
          },
    })
    return response.data;
};
export default unFollow;

// http://127.0.0.1:8000/api/user/1/unfollow/