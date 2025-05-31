export interface Announcement {
    id: number;
    sports: string[];
    caption: string;
    description: string;
    created_at: string;
    start_date: string;
    end_date: string;
    required_amount: number;
    status: number;
    creator: number;
    user_request_status: 0 | 1 | 2 | 4 | null;  // 0: Rejected, 1: Accepted, 2: Pending, 4: Dismissed
}