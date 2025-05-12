import { SportInterface } from "@/API/sport/getSports";

export interface Marker {
   id: number,
            creator: {
                id: number,
                username: string,
                pfp_url: string
            },
    latitude: string;
    longitude: string;
    country: string;
    city: string;
    created_at: string;
    valid_until: string;
    announcement: number;
    sports: SportInterface[];
}
