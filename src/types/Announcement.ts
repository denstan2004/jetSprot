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
}