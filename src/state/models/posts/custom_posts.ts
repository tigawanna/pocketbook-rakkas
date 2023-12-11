import dayjs from "dayjs";
import { PocketBaseClient } from "@/lib/pb/client";
import {
  CustomPocketbookPosts,
  OneCustomPocketbookPost,
  CustomPocketbookRoutesEndpoints,
  CustomPocketbookPostReplies,
} from "@/lib/pb/custom_routes/types";

const currentdate = dayjs(new Date()).format(
  "[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]",
);

interface QueryVariables {
  user_id?: string;
  // key: "one_custom_pocketbook_post" | "custom_pocketbook_posts" | "custom_pocketbook_post_replies";
  post_id?: string; //can also be the parent query param
  depth?: number;
  profile?: string;
  get_one_post?: boolean;
}

interface Pagination_params {
  created: string;
  id: string;
}

type GetCustomPostsParams = {
  pb: PocketBaseClient;
  query_vars: QueryVariables;
  pagination_params?: Partial<Pagination_params>;
};
export async function getCustomPosts({
  pb,
  query_vars,
  pagination_params,
}: GetCustomPostsParams) {
  const { user_id, depth, profile } = query_vars;

  const params: CustomPocketbookPosts["params"] = {
    id: pagination_params?.id,
    depth: depth,
    profile: profile ?? "general",
    limit: 5,
    user: user_id,
    created: pagination_params?.created ?? (currentdate as string),
  };
  try {
    const posts = await pb.send<CustomPocketbookPosts["response"]["200"]>(
      CustomPocketbookRoutesEndpoints.CustomPocketbookPosts,
      {
        params,
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      },
    );

    return posts;
  } catch (error) {
    // logError("error getting paginated posts ==== ", error);
    throw error;
  }
}
type GetCustomPostsRepliesParams = {
  pb: PocketBaseClient;
  query_vars: QueryVariables;
  pagination_params?: Partial<Pagination_params>;
};
export async function getCustomPostReplies({
  pb,
  query_vars,
  pagination_params,
}: GetCustomPostsRepliesParams) {
  const { user_id, depth, post_id, profile } = query_vars;

  const params: CustomPocketbookPostReplies["params"] = {
    id: pagination_params?.id,
    depth: depth,
    profile: profile ?? "general",
    parent: post_id ?? "original",
    limit: 5,
    user: user_id,
    created: pagination_params?.created ?? (currentdate as string),
  };
  try {
    const posts = await pb.send<CustomPocketbookPostReplies["response"]["200"]>(
      CustomPocketbookRoutesEndpoints.CustomPocketbookPostReplies,
      {
        params,
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      },
    );

    return posts;
  } catch (error) {
    // logError("error getting paginated posts ==== ", error);
    throw error;
  }
}

type GetOneCustomPostParams = {
  pb: PocketBaseClient;
  query_params: OneCustomPocketbookPost["params"];
};
export async function getOneCustomPost({
  pb,
  query_params,
}: GetOneCustomPostParams) {
  try {
    const posts = await pb.send<OneCustomPocketbookPost["response"]["200"]>(
      CustomPocketbookRoutesEndpoints.OneCustomPocketbookPost,
      {
        params: { ...query_params },
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      },
    );

    return posts;
  } catch (error) {
    // logError("error getting paginated posts ==== ", error);
    throw error;
  }
}

// export async function getPaginatedPosts(
//   query_vars: QueryVariables,
//   pagination_params?: Partial<Pagination_params>
// ) {
//   // //no-console(" query vars === ", query_vars);

//   const postsUrl = new URL(`${RAKKAS_PB_URL}/${query_vars.key}`);
//   const { user_id, depth, post_id, profile } = query_vars;

//   if (query_vars.get_one_post) {
//     postsUrl.searchParams.set("id", post_id as string);
//     postsUrl.searchParams.set("user", user_id as string);
//     postsUrl.searchParams.set("limit", "5");
//   } else {
//     postsUrl.searchParams.set("id", pagination_params?.id as string);
//     postsUrl.searchParams.set("depth", depth?.toString() as string);
//     postsUrl.searchParams.set("profile", profile ?? "general");
//     postsUrl.searchParams.set("parent", post_id ?? "original");
//     postsUrl.searchParams.set("limit", "5");
//     postsUrl.searchParams.set("user", user_id as string);
//     postsUrl.searchParams.set(
//       "created",
//       pagination_params?.created ?? (currentdate as string)
//     );
//   }

//   const url = postsUrl.toString();
//   // const url = `${pb_url}/custom_posts/?id=${deps?.pageParam?.id ?? ""}&user=${
//   //     user?.id ?? ""
//   // }&created=${deps?.pageParam?.created ?? currentdate}`;

//   let headersList = {
//     Accept: "*/*",
//   };
//   try {
//     const response = await fetch(url, {
//       method: "GET",
//       headers: headersList,
//     });
//     const data = await response.json();
//     //no-console("response === ", data);
//     if (data.code === 400) {
//       throw new Error(data.message);
//     }
//     return data as CustomPostType[];
//   } catch (e: any) {
//     //no-console("error fetching custom ", e);
//     throw new Error(e.message);
//   }
// }

// export async function getPbPaginatedPosts(
//   pb: PocketBaseClient,
//   query_vars: QueryVariables,
//   pagination_params?: Partial<Pagination_params>
// ) {
//   // logNormal("getPbPaginatedPosts query_vars  ==== ", query_vars);
//   // logNormal("getPbPaginatedPosts pagination params === ", pagination_params);
//   const { user_id, depth, post_id, profile, key } = query_vars;

//   function get_pb_params(is_one_post?: boolean) {
//     if (is_one_post) {
//       return {
//         id: query_vars.post_id,
//         user: user_id,
//         limit: 1,
//       };
//     }
//     return {
//       id: pagination_params?.id,
//       depth: depth,
//       profile: profile ?? "general",
//       parent: post_id ?? "original",
//       limit: 5,
//       user: user_id,
//       created: pagination_params?.created ?? (currentdate as string),
//     };
//   }

//   try {
//     const posts = await pb.send<CustomPostType>(key, {
//       params: get_pb_params(query_vars.get_one_post),
//       headers: {
//         Accept: "*/*",
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${pb.authStore.token}`,
//       },
//     });

//     return posts;
//   } catch (error) {
//     // logError("error getting paginated posts ==== ", error);
//     throw error;
//   }
// }
