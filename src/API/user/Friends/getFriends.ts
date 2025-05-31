import axios from "axios"
import { apiUrl } from "@/API/apiUrl"

export const getFriends = async (token: string) => {
    const response =await axios.get(`${apiUrl}/user/friends`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data;
}
