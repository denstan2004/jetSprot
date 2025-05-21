export interface Comment {
  id: number;
  content: string;
  author_username: string;
  likes: number;
  created_at: string;
  publication: number;
  parent_comment: null;
  replies: [];
  is_liked: boolean;
}
