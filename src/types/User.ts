export interface User {
  id: number;
  is_staff: boolean;
  is_friends: boolean;
  last_login: null;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  pfp_url: string;
  rating: number;
  country: string;
  city: string;
  account_status: string;
  account_type: string;
  is_verified?: boolean;
}
