export interface Post {
    id: number,
    caption: string,
    description:string,
    creator: number,
    creator_username: string,
    created_at: string,
    media: string,
    hashtags: string,
    likes: number,
    comments: [],
    is_liked: boolean
}