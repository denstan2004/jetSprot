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

// export interface Comment {
//     id: number;
//     content: string;

//     created_at: string;
//     likes: string;

//     author_id: number;
//     parent_comment_id: number;
//     publication_id: number;
// }
