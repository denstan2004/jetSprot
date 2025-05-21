import axios from "axios";
import { apiUrl } from "../apiUrl";

const getReviewBy2IDs = async (id1: string, id2: string) => {
  const response = await axios.get(
    `${apiUrl}/review/find/?creator=${id1}&reviewed_user=${id2}`
  );
  return response.data;
};

export default getReviewBy2IDs;
