export interface Review {
  id: number;
  creator: number;
  description: string | null;
  rating: number;
  created_at: string;
  status: string;
  reviewed_user: number;
};
