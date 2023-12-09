"use client";
import { useMutationWrapper } from "@/state/hooks/useMutation";
import { Heart,MessageSquare } from "lucide-react";
import React, { Suspense } from "react";
import { PostMutationDialog } from "./PostMutationDialog";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import { TimeCompponent } from "../../wrappers/TimeCompponent";
import {
  createReactionToPost,
  updateReactionToPost,
} from "@/state/models/posts/posts";
import {  OneCustomPostType } from "@/state/models/posts/types";
import { PocketbookUserResponse } from "@/lib/pb/db-types";
import { PocketBaseClient, getFileURL } from "@/lib/pb/client";
import { Link, navigate, useLocation } from "rakkasjs";

interface PostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  pb: PocketBaseClient;
  item: OneCustomPostType;
  user?: PocketbookUserResponse;
  is_reply: boolean;
}

export const PostsCard = ({
  pb,
  item,
  user,
  is_reply,
  ...props
}: PostCardProps) => {
  const post_img_url = getFileURL({
    collection_id_or_name: "pocketbook_posts",
    record_id: item?.post_id,
    file_name: item?.post_media,
  });

  //   const one_post_url= new URL(pathname)
  //  one_post_url.searchParams.set("post",item?.post_id)
  //  one_post_url.searchParams.set("post_slug",JSON.stringify(item))
  const {current}=  useLocation()
  const one_post_url = new URL(current)
  one_post_url.pathname="/post"
  one_post_url.searchParams.set("post", item?.post_id);
  one_post_url.searchParams.set("post_slug", JSON.stringify(item));
  
  const profile_url= new URL(current)
  profile_url.pathname="/profile"
  profile_url.searchParams.set("id", item?.creator_id);

  // console.log({ item });

  const post_params = ` post_description=${item?.post_body}
  &post_author=${item?.creator_name}&depth=${parseInt(item?.post_depth) + 1}`;
  const card_styles = twMerge(
    `w-full h-full p-1 flex flex-col hover:shadow-sm hover:shadow-accent-foreground
    border shadow-secondary-foreground shadow rounded-md`,
    props.className,
  );
  return (
    <Suspense
      key={item.post_id}
      fallback={<Skeleton className="w-full h-[100px] rounded-full" />}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          navigate(one_post_url.toString());
        }}
        {...props}
        className={card_styles}
      >
        <div className="w-full flex flex-col  items-start gap-1 p-2">
          <Link href={profile_url.toString()}
            // href={{
            //   pathname: `/profile/${item?.creator_id}`,
            //   query: {
            //     id: item?.creator_id,
            //   },
            // }}
            onClick={(e) => {
              e.stopPropagation();
              // push(`/profile/${item?.creator_id}`);
            }}
            className="w-fit px-1 flex justify-start items-center gap-[1px]
                 cursor-pointer hover:bg-base-300 rounded-full"
          >
            <div className=" h-8 w-8 md:w-10 md:h-10 ">
              {item?.creator_image ? (
                <img
                  src={item?.creator_image}
                  alt="creator name"
                  height={50}
                  width={50}
                  // src={makeUrl('devs', item.creator_id, item.creator_image)}
                  className=" w-full h-full rounded-full aspect-square"
                />
              ) : null}
            </div>
            <div className="flex items-center text-blue-700 justifycenter text-md font-bold px-2">
              {item?.creator_name}
            </div>
          </Link>
          <TimeCompponent
            className="text-xs font-thin"
            relative={is_reply}
            time={item?.created_at}
            format="ddd, MMM D, YYYY h:mm A"
          />
        </div>

        <div className="w-full  flex items-center justify-start p-1">
          {item?.post_body}
        </div>
        <div className="w-full flex items-center justify-center ">
          {post_img_url ? (
            <img
              src={post_img_url}
              alt={item.creator_name + "'s post"}
              height={150}
              width={150}
              className=" w-full h-auto rounded-sm"
              // alt='../../assets/placeholder.svg'
              loading="lazy"
            />
          ) : null}
        </div>
        <div className="w-full"></div>
        <div className="w-full  flex p-2">
          <PostReactionsCard user={user} item={item} pb={pb}/>
        </div>
      </div>
    </Suspense>
  );
};

interface PostReactionsCardProps {
  pb: PocketBaseClient;
  user?: PocketbookUserResponse;
  item: OneCustomPostType;
}

export const PostReactionsCard = ({ pb,user, item }: PostReactionsCardProps) => {
  const [liked, setLiked] = React.useState(item?.mylike === "yes");
  const newReactionMutation = useMutationWrapper({
    fetcher: createReactionToPost,
    // refresh:true,
    success_message: "",
    invalidates: ["custom_pocketbook_posts"],
  });
  const updateReactionMutation = useMutationWrapper({
    fetcher: updateReactionToPost,
    //   refresh: true,
    success_message: "",
    invalidates: ["custom_pocketbook_posts"],
    refresh: false,
  });

  // console.log("item before reaction  ==== ", item);
  return (
    <div className="w-full p-1  ">
      <div className="w-full flex items-center justify-between text-sm">
        <div className="flex items-center justify-center gap-1">
          <Heart
            fill={liked ? "red" : ""}
            className={liked ? "text-red-600 w-5 h-5" : "w-5 h-5"}
            onClick={(e) => {
              e.stopPropagation();
              if (user) {
                if (
                  item?.mylike !== "virgin" &&
                  item?.reaction_id &&
                  item?.reaction_id !== ""
                ) {
                  updateReactionMutation.mutate({
                    pb,
                    is_liked: item.mylike,
                    reaction_id: item.reaction_id,
                  });
                  setLiked((prev) => !prev);
                } else {
                  newReactionMutation.mutate({
                    pb,
                    post_id: item.post_id,
                    user_id: user.id,
                  });
                  setLiked((prev) => !prev);
                }
              } else {
                navigate("/auth");
              }
            }}
          />
          {item?.likes ?? 0}
        </div>
        <div className="flex items-center justify-center gap-1">
          <PostMutationDialog
            depth={parseInt(item.post_depth + 1)}
            parent={item?.post_id}
            user={user}
            label={`replying to ${item?.creator_name}`}
            icon={
              <MessageSquare
                onClick={(e) => {
                  e.stopPropagation();
                }}
                fill={item?.myreply !== "virgin" ? "blue" : ""}
                className={
                  item?.myreply !== "virgin"
                    ? "text-accent-foreground w-5 h-5"
                    : "w-5 h-5"
                }
              />
            }
          />

          {item?.replies ?? 0}
        </div>
      </div>
    </div>
  );
};
