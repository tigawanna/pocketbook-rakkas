/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { PostMutationDialog } from "./PostMutationDialog";
import { Plus } from "lucide-react";
import { PBUserRecord } from "@/state/user";
import React, { useEffect } from "react";
import { PostsCard } from "./PostCard";
import { useInView } from "react-intersection-observer";
import { pb } from "@/state/pb/config";
import { ScrollArea } from "@/components/shadcn/ui/scroll-area";
import { ErrorOutput } from "../wrappers/ErrorOutput";
import { getPbPaginatedPosts } from "@/state/models/posts/custom_posts";

interface TimelineProps {
  user: PBUserRecord;
  profile?: "general";
  main_key:
    | "one_custom_pocketbook_post"
    | "custom_pocketbook_posts"
    | "custom_pocketbook_post_replies";
  extra_keys?: string[];
  post_id?: string;
  is_replies: boolean;
}

export function Timeline({
  user,
  main_key,
  extra_keys,
  profile,
  post_id,
  is_replies,
}: TimelineProps) {
  const { ref, inView } = useInView();
  const key = extra_keys ? [main_key, ...extra_keys] : [main_key];

  // console.log("key in tineline  ==== ",key)
  const currentdate = dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ssZ[Z]");

  const customPostsQuery = useInfiniteQuery({
    queryKey: key,
    queryFn: ({ queryKey, pageParam }) =>
      getPbPaginatedPosts(
        pb,
        { depth: 0, post_id, profile, user_id: user?.id ?? "", key: main_key },
        pageParam,
      ),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.result[lastPage.result.length - 1]) {
        return {
          created: lastPage.result[lastPage?.result.length - 1]?.created_at,
          id: lastPage.result[lastPage?.result.length - 1]?.post_id,
        };
      }
      return;
    },

    initialPageParam: {
      created: currentdate,
      id: "",
    },
    // enabled:false
  });

  const data = customPostsQuery.data;
  // console.log({data})
  useEffect(() => {
    if (inView) {
      customPostsQuery.fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="w-full h-full flex flex-col  items-center justify-center">
      {customPostsQuery?.error && (
        <ErrorOutput error={customPostsQuery.error} />
      )}
      {data?.pages && data?.pages?.length < 1 && (
        <div className="p-5 bg-base-200">Nothing to show for now</div>
      )}

      <ScrollArea className="h-full w-full flex flex-col ">
        {data &&
          data.pages.map((group, i) => (
            <React.Fragment key={i}>
              <div className="h-full w-full flex flex-col gap-3 p-3">
                {/* <SuspenseList revealOrder="forwards" tail="collapsed"> */}
                {group.result.map((post) => (
                  <PostsCard
                    key={post.post_id}
                    item={post}
                    user={user}
                    is_reply={is_replies}
                  />
                ))}
                {/* </SuspenseList> */}
              </div>
            </React.Fragment>
          ))}
      </ScrollArea>

      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed bottom-16 right-[3%]"
      >
        <PostMutationDialog
          user={user}
          icon={
            <Plus
              className="h-12 w-12 p-1 rounded-full border-2 hover:border-accent-foreground
              hover:shadow-sm hover:shadow-accent-foreground hover:text-accent-foreground"
            />
          }
        />
      </div>

      <button
        ref={ref}
        onClick={() => customPostsQuery.fetchNextPage()}
        disabled={
          !customPostsQuery.hasNextPage || customPostsQuery.isFetchingNextPage
        }
      >
        {customPostsQuery.isFetchingNextPage
          ? "Loading more..."
          : customPostsQuery.hasNextPage
            ? ""
            : !customPostsQuery.isLoading
              ? ""
              : null}
      </button>
    </div>
  );
}
