import axios from "axios";
import { apiUrl } from "../../apiUrl";

interface GetFillteredMarkersProps {
  event_type?: number;
  status?: number;
  sports_id?: number[];
  country?: string;
  city?: number;
  user?: number;
  min_required_amount?: number;
  start_date?: string;
  end_date?: string;
  creator_username?: string;
}
const getFillteredMarkersUrl = (props: GetFillteredMarkersProps) => {
  let url = `${apiUrl}/marker/search/?`;
  if (props.event_type) {
      url += `&event_type=${props.event_type}`;
  }
  if (props.status) {
      url += `&status=${props.status}`;
  }
  if (props.sports_id) {
    for (const sport of props.sports_id) {
      url += `&sport_id=${sport}`;
    }
  }
  if (props.country) {
      url += `&country=${props.country}`;
  }
  if (props.city) {
      url += `&city=${props.city}`;
  }
  if (props.start_date) {
      url += `&start_date=${props.start_date}`;
  }
  if (props.end_date) {
      url += `&end_date=${props.end_date}`;
  }
  if (props.min_required_amount) {
      url += `&min_required_amount=${props.min_required_amount}`;
  }
  return url;
}
export const filterMarkers = async (token: string, filterParams: GetFillteredMarkersProps) => {
  console.log( getFillteredMarkersUrl(filterParams));
  const url = getFillteredMarkersUrl(filterParams);
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};