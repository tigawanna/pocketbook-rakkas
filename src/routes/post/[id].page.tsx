import { PostsCard } from "@/components/posts/timeline/PostCard";
import { SidePanel } from "@/components/posts/timeline/SidePanel";
import { Timeline } from "@/components/posts/timeline/Timeline";
import { CustomPocketbookRoutesType } from "@/lib/pb/db-types";
import { useUser } from "@/lib/rakkas/hooks/useUser";
import { getPbPaginatedPosts } from "@/state/models/posts/custom_posts";
import { OneCustomPostType } from "@/state/models/posts/types";
import { PBUserRecord } from "@/state/models/user/types";
import { tryCatchWrapper } from "@/utils/helpers/async";
import { useSuspenseQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChevronLeft } from "lucide-react";
import { Link, PageProps, usePageContext } from "rakkasjs";
import { Suspense } from "react";


export default function OnePostPage({ params, url }: PageProps) {
  const depth = url.searchParams.get("depth") ?? "1";
  const currentdate = dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ssZ[Z]");
  const { user } = useUser();

  const post_id = params.id as string;
  const one_post_key = [
    CustomPocketbookRoutesType.OneCustomPocketbookPost,
    post_id,
  ] as const;
  const page_ctx = usePageContext();
  const pb = page_ctx.locals.pb;

  const query = useSuspenseQuery({
    queryKey: one_post_key,
    queryFn: () =>
      tryCatchWrapper(
        getPbPaginatedPosts(
          pb,
          {
            post_id,
            user_id: user?.id ?? "",
            get_one_post: true,
            key: one_post_key[0],
            depth: parseInt(depth),
          },
          {
            created: currentdate,
            id: "",
          },
        ),
      ),
  });
  const one_post = query.data?.data?.result

console.log({one_post})
  return (
    <main className="w-full h-full min-h-screen flex flex-col items-center">
      <div className="w-full flex items-cente justify-center">
        <div className="w-full flex flex-col items-center justify-start gap-2 p-2 sticky top-1">
          <div className="w-full  flex gap-2 items-center ">
            <Link href="..">
            <ChevronLeft
              className="h-7 w-7 hover:text-accent-foreground"
              size={10}
            />

            </Link>
            {/* <ClientLink to={-1}>
          </ClientLink> */}

            {/* <h2 className="text-2xl font-bold w-full">
            {one_post.result[0]?.creator_name}
          </h2> */}
          </div>
          <div className="w-full ">
            {one_post && (
              <PostsCard
                pb={pb}
                className="border-none border-b-4 border-b-accent-foreground p-2 bg-base-300"
                item={one_post}
                is_reply={false}
                user={pb.authStore.model as unknown as PBUserRecord}
              />
            )}
          </div>
          {/* <Suspense fallback={"loading"}>
            <Timeline
              user={pb.authStore.model as unknown as PBUserRecord}
              post_id={params.post}
              main_key={one_post_key[0]}
              extra_keys={one_post_key.slice(1)}
              is_replies={true}
            />
          </Suspense> */}
        </div>

        <div className="hidden lg:flex min-h-[200px] h-full w-[50%] p-2">
          <SidePanel />
        </div>
      </div>
    </main>
  );
}
