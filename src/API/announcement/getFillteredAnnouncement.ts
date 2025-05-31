import axios from "axios";
import { apiUrl } from "../apiUrl";

interface GetFillteredAnnouncementProps {
    event_type?: number;
    status?: number;
    sport_id?: number;
    caption?: string;
    start_date?: string;
    end_date?: string;
    creator_username?: string;
    min_required_amount?: number;
}

const getFillteredAnnouncementUrl = (props: GetFillteredAnnouncementProps) => {
    let url = `${apiUrl}/announcement/search/`;
    if (props.event_type) {
        url += `&event_type=${props.event_type}`;
    }
    if (props.status) {
        url += `&status=${props.status}`;
    }
    if (props.sport_id) {
        url += `&sport_id=${props.sport_id}`;
    }
    if (props.caption) {
        url += `&caption=${props.caption}`;
    }   
    if (props.start_date) {
        url += `&start_date=${props.start_date}`;
    }
    if (props.end_date) {
        url += `&end_date=${props.end_date}`;
    }
    if (props.creator_username) {
        url += `&creator_username=${props.creator_username}`;
    }
    if (props.min_required_amount) {
        url += `&min_required_amount=${props.min_required_amount}`;
    }
    return url;
}
export const getFillteredAnnouncement = async (token: string, props: GetFillteredAnnouncementProps) => {
    console.log(props);
    console.log(getFillteredAnnouncementUrl(props));
    const response = await axios.get(getFillteredAnnouncementUrl(props), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(response.data);
    return response.data;
}