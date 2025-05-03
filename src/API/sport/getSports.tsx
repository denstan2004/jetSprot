import { apiUrl } from "../apiUrl";

import axios from "axios";

interface SportRequestInterface {
  count: number;
  next: string | null;
  previous: string | null;
  results: { id: number; name: string }[];
}
export interface SportInterface {
  id: number;
  name: string;
}

export const getSports = async (): Promise<SportInterface[]> => {
  const response = await axios.get<SportRequestInterface>(`${apiUrl}/sport/`);
  return response.data.results;
};
