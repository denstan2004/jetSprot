export interface Comment {
    id: bigint;
    content: string;

    created_at: BigInteger;
    likes: BigInteger;

    author_id: bigint;
    parent_comment_id: bigint;
    publication_id: bigint;
}