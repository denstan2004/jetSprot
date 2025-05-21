export interface Report {
  id: number;
  status: string;
  category: string;
  description: string;
  created_at: string;
  reviewed_at: string | null;
  reporter: number;
  reported_user: number;
  reviewed_by: number | null;
}

export interface ReportResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Report[];
}