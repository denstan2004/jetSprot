export interface Announcement {
    id: number;
    sports: string[];
    caption: string;
    description: string;
    created_at: string;
    valid_until: string;
    required_amount: number;
    status: number;
    creator: number;
}