import dayjs from "dayjs";
import { PocketBaseClient } from "@/lib/pb/client";
import { CustomPocketbookRoutesType, PocketbookFriendsResponse } from "@/lib/pb/db-types";

const currentdate = dayjs(new Date()).format(
  "[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]"
);

export interface QueryVariables {
  user_id?: string;
  logged_in: string;
  type: "followers" | "following";
  id?: string;
  limit: string;
  created: string;
}

interface Pagination_params {
  created: string;
  id: string;
}

export async function getPbPaginatedFriends(
  pb: PocketBaseClient,
  query_vars: QueryVariables,
  pagination_params?: Partial<Pagination_params>
) {
  const { user_id, logged_in, type } = query_vars;
  const params: QueryVariables = {
    id: pagination_params?.id,
    user_id,
    logged_in,
    type,
    limit: "5",
    created: pagination_params?.created ?? (currentdate as string),
  };

  try {
    const posts = await pb.send<PocketbookFriendsResponse>(CustomPocketbookRoutesType.CustomPocketbookFriends, {
      params,
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pb.authStore.token}`,
      },
    });

    return posts;
  } catch (error) {
    console.log("error getting paginated posts ==== ", error);
    throw error;
  }
}
