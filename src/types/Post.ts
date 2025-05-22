import { SportInterface } from "@/API/sport/getSports";

export interface CommentInterface{
    id: number,
    content: string,
    author_username: string,
    likes: number,
    created_at: string,
    publication: number,
    parent_comment: number | null,
    replies: CommentInterface[],
    is_liked: boolean
}
export interface Post {
    id: number,
    caption: string,
    creator: number,
    creator_username: string,
    description:string,
    created_at: string,
media_files: Media[],
    hashtags: string,
    likes: number,
    comments: CommentInterface[],
    sports: SportInterface[],
    is_liked: boolean
}
export interface Media{
    media_url: string,
}