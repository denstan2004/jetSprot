import axios from "axios";
import { apiUrl } from "../apiUrl";

const acceptRequest = async (requestId: number, token: string) => {
  const response = await axios.post(`${apiUrl}/request/${requestId}/accept/`, {},{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default acceptRequest;