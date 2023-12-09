import { PocketbookPostsResponse, PocketbookUserResponse } from "@/lib/pb/db-types"




export interface CustomPostType {
  result: OneCustomPostType[]
}

export interface OneCustomPostType {
  creator_id: string
  creator_name: string
  post_body: string
  created_at: string
  reaction_id: string
  replies: string
  likes: string

  creator_image: string
  post_parent: string
  post_depth: string
  post_id: string
  post_media: string
  mylike: "yes" | "no" | "virgin";
  myreply: string | "virgin";
}

export interface ReactionMutationResponse {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  liked: "yes" | "no";
  post: string;
  updated: string;
  user: string;
  expand: {};
}

export interface CustomRepliesType {
  creator_id: string;
  creator_name: string;
  creator_image: string;
  reply_id: string;
  reply_body: string;
  reply_media: string;
  replied_at: Date;
  reply_depth: string;
  replying_to: string;
  likes: number;
  mylike: string;
  reaction_id: string;
  replies: number;
  myreply: string;
}

export interface RepliesType {
  body: string;
  collectionId: string;
  collectionName: string;
  created: string;
  depth: number;
  expand: RepliesTypeExpand;
  id: string;
  media: string;
  parent: string;
  post: string;
  updated: string;
  user: string;
}

export interface IPostRecord {
  body: string;
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  media: string | File | null;
  title: string;
  updated: string;
  user: string;
  depth?: number;
  parent?: string;
  expand: {};
}

export interface RepliesTypeExpand {
  post: PocketbookPostsResponse;
  user: PocketbookUserResponse;
  parent?: RepliesType;
}
