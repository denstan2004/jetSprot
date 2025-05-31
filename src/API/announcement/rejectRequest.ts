import axios from "axios";
import { apiUrl } from "../apiUrl";

const rejectRequest = async (requestId: number, token: string) => {
  console.log("token", token);
  const response = await axios.post(`${apiUrl}/request/${requestId}/reject/`, {},{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};  

export default rejectRequest;