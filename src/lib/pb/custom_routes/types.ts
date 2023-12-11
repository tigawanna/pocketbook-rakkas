export enum CustomPocketbookRoutesEndpoints {
  CustomPocketbookNotificationsCount = "custom_pocketbook_notifications_count",
  CustomPocketbookFriends = "custom_pocketbook_friends",
  CustomPocketbookPosts = "custom_pocketbook_posts",
  OneCustomPocketbookPost = "one_custom_pocketbook_post",
  CustomPocketbookPostReplies = "custom_pocketbook_post_replies",
  // Add other collection names here
}
export type CustomRoutes={
    posts: CustomPocketbookPosts;
    replies: CustomPocketbookPostReplies;
    one_post: OneCustomPocketbookPost;

}

export type CustomPocketbookPost = {
  creator_id: string;
  creator_name: string;
  creator_image: string;
  post_id: string;
  post_body: string;
  post_media: string;
  post_parent: string;
  post_depth: number;
  created_at: string;
  likes: string;
  reaction_id: string;
  replies: string;
  mylike: "yes" | "no" | "virgin";
  myreply: string | "virgin";
};

export type CustomPocketbookPosts = {
    endpoint: CustomPocketbookRoutesEndpoints.CustomPocketbookPosts;
  params: {
    user?: string;
    id?: string;
    depth?: number; // defaults to 0
    profile?: string; // user id or defaults to general
    created?: string; // current date defaults new Date().toISOString()
    limit?: number; // defults to 5
  };
  response: {
    "200": {
      result: CustomPocketbookPost[];
    };
  };
};
export type CustomPocketbookPostReplies = {
    endpoint: CustomPocketbookRoutesEndpoints.CustomPocketbookPostReplies;
  params: {
    user?: string;
    id?: string;
    parent: string | "original"; // id of the parent post
    depth?: number; // defaults to 1 or >1
    profile?: string; // user id or defaults to general
    created?: string; // current date defaults new Date().toISOString()
    limit?: number; // defults to 5
  };
  response: {
    "200": {
      result: CustomPocketbookPost[];
    };
  };
};

export type OneCustomPocketbookPost = {
    endpoint: CustomPocketbookRoutesEndpoints.OneCustomPocketbookPost;
  params: {
    id: string;
    user: string;
  };
  response: {
    "200": {
      result: CustomPocketbookPost;
    };
  };
};
