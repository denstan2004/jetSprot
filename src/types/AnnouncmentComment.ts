export interface AnnouncementComment {
  id: number;
  content: string;
  author_username: string;
  likes: number;
  created_at: string;
  announcement: number;
  parent_comment: null;
  replies: [];
  is_liked: boolean;
}
