export interface Event {
  id: 1;
  announcement: {
    id: number;
    caption: string;
    description: string;
  };
  marker: {
    id: number;
    creator: {
      id: number;
      username: string;
      pfp_url: string;
    };
    latitude: string;
    longitude: string;
    country: string;
    city: string;
    created_at: string;
    valid_until: string | null;
    announcement: number;
    sports: {
      id: number;
      name: string;
    }[];
    is_creator: boolean;
    announcement_status: number;
  };
  status: string;
  created_at: string;
  reviewed_at: string | null;
  created_by: number;
  reviewed_by: number | null;
}
