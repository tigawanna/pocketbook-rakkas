"use client";
import { QueryVariables } from "@/state/models/friends/custom_friends";
import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { FollowingCard } from "./FollowingCard";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useUser } from "@/lib/rakkas/hooks/useUser";
import { tryCatchWrapper } from "@/utils/helpers/async";
import { and, or} from "typed-pocketbase";

interface FollowingProps {
  profile_id: string;
  limit?: string;
}

export function Following({
  limit = "12",
  profile_id,
}: FollowingProps) {
  const { user: logged_in, pb } = useUser();
  const { ref, inView } = useInView();
  const currentdate = dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ssZ[Z]");

  const params: QueryVariables = {
    created: currentdate,
    limit,
    logged_in: logged_in.id,
    type:"following",
    user_id: profile_id,
  };

  const query_key = ["profile",`following`, params];
  


  const query = useInfiniteQuery({
    queryKey: query_key,
    queryFn: ({ queryKey, pageParam }) =>
      tryCatchWrapper(
        pb.collection("pocketbook_friendship").getList(pageParam?.page, 12, {
          filter: or(
            and(
              ["user_a.id", "=", profile_id],
              ["user_a_follow_user_b", "=", "yes"],
            ),
            and(
              ["user_b.id", "=", profile_id],
              ["user_b_follow_user_a", "=", "yes"],
            ),
          ),
        }),
      ),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data) {
        return {
          page: lastPage.data.page + 1,
        };
      }

      return;
    },
    initialPageParam: {
      page: 1,
    },
    // enabled:false
  });

  useEffect(() => {
    if (inView) {
      query.fetchNextPage();
    }
  }, [inView]);

  //   if (query.isPending) {
  //     return (
  //       <div className="w-full h-full flex flex-col items-center justify-center bg-red-900 text-red-300 rounded-lg p-5">
  //         loading following
  //       </div>
  //     );
  //   }

  //   if (query.error) {
  //     return (
  //       <div
  //         className="w-full h-full flex flex-col items-center justify-center bg-red-900 text-red-300
  // rounded-lg p-5
  // ">
  //         error loading following {query.error?.message}
  //       </div>
  //     );
  //   }

  //   if (!query.data) {
  //     return (
  //       <div
  //         className="w-full h-full flex flex-col items-center justify-center text-lg
  // rounded-lg p-5
  // ">
  //         no following
  //       </div>
  //     );
  //   }

  return (
    <div className="w-full h-full flex items-center justify-center animate-in fade-in">
      {query.data &&
        query.data.pages.map((page, idx) => {
          return (
            <div
              key={idx}
              className="w-full flex flex-wrap gap-2 items-center justify-center"
            >
              {page.data?.items.map((profile) => {
                return (
                  <FollowingCard
                    pb={pb}
                    profile_id={profile_id}
                    friend={profile}
                    me={logged_in}
                    key={profile.id}
                  />
                );
              })}
            </div>
          );
        })}
      <button
        ref={ref}
        onClick={() => query.fetchNextPage()}
        disabled={!query.hasNextPage || query.isFetchingNextPage}
      >
        {query.isFetchingNextPage
          ? "Loading more..."
          : query.hasNextPage
            ? ""
            : !query.isLoading
              ? ""
              : null}
      </button>
    </div>
  );
}
