import { PocketBaseClient } from "@/lib/pb/client";
import { IPostRecord } from "./types";
import { sort } from "typed-pocketbase";
import { PocketbookPostsCreate, PocketbookPostsUpdate } from "@/lib/pb/db-types";

interface GetPostsParams {
  pb: PocketBaseClient;
  page: number;
}
export async function getPosts({ pb, page }: GetPostsParams) {
  try {
    const resultList = await pb
      .collection("pocketbook_posts")
      .getList(page, 2, {
        sort:sort("-created"),
        // filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2',
      });
    return resultList;
  } catch (error: any) {
    // return new Error(error);
    throw error;
  }
}

export type PostMutationInput = Pick<
  IPostRecord,
  "body" | "media" | "title" | "user" | "depth" | "parent"
>;
interface CreateUserProps {
  pb:PocketBaseClient
  data: PocketbookPostsCreate
}

export async function createNewPost({ pb,data }: CreateUserProps) {
  try {
    return await pb.collection("pocketbook_posts").create(data);
  } catch (error: any) {
    throw error;
  }
}
interface UpdateUserProps {
  pb: PocketBaseClient
  id: string;
  data:PocketbookPostsUpdate;
}

export async function updatePost({ pb,id,data }: UpdateUserProps) {
  try {
    return await pb.collection("pocketbook_posts").update(id, data);
  } catch (error: any) {
    throw error;
  }
}

export interface ICreatePostReaction {
  pb: PocketBaseClient;
  post_id: string;
  user_id: string;
}
export async function createReactionToPost({
  pb,
  post_id,
  user_id,
}: ICreatePostReaction) {
  const newReaction = {
    post: post_id,
    user: user_id,
    liked: "yes",
  } as const
  try {
    const response = await pb.collection("pocketbook_reactions").create({...newReaction});
    return response;
  } catch (err: any) {
    throw err;
  }
}

export interface IUpdatePostReaction {
  pb: PocketBaseClient
  reaction_id: string;
  is_liked: "yes" | "no";
}
export async function updateReactionToPost({
  pb,
  reaction_id,
  is_liked,
}: IUpdatePostReaction) {
  const updatevars = { liked: is_liked === "yes" ? "no" : "yes" } as const
  try {
    const response = await pb
      .collection("pocketbook_reactions")
      .update(reaction_id, {...updatevars});
    return response;
  } catch (err: any) {
    throw err;
  }
}
