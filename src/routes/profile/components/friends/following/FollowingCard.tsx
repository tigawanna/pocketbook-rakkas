import { Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import AsyncButton from "@/components/wrappers/AsyncButton";
import { useState } from "react";
import { PocketBaseClient } from "@/lib/pb/client";
import {  PocketbookFriendshipResponse, PocketbookUserResponse } from "@/lib/pb/db-types";
import { Link } from "rakkasjs";
import { updateFriendship } from "@/state/models/friends/frenship";
import { isString } from "@/utils/helpers/string";


interface FollowingCardProps {
  pb:PocketBaseClient
  friend:PocketbookFriendshipResponse;
  profile_id:string;
  me: PocketbookUserResponse;
}

export function FollowingCard({ pb, friend, profile_id, me }: FollowingCardProps) {
  return (
    <Link
      href={`../profile/${friend.id}`}
      className="w-full lg:w-[45%] flex items-center  gap-2 p-2 bg-base-300
      rounded-lg border border-accent shadow "
    >
      <div className="w-[25%]  h-full flex items-center justify-center rounded-2xl">
        {friend.user_a === profile_id && (
          <img
            src={friend?.user_b_avatar}
            alt="user image"
            height={50}
            width={50}
            className="rounded-full h-auto  
            aspect-square object-cover flex items-center justify-center"
          />
        )}
        {friend.user_b === profile_id && (
          <img
            src={friend?.user_a_avatar}
            alt="user image"
            height={50}
            width={50}
            className="rounded-full h-auto  
            aspect-square object-cover flex items-center justify-center"
          />
        )}
      </div>

      <div className="w-full h-full flex flex-col items-cente justify-center text-xs gap-1">
        {friend.user_a === profile_id && isString(friend?.user_b_name) && (
          <h1> @{friend.user_b_name}</h1>
        )}
        {friend.user_b === profile_id && isString(friend?.user_a_name) && (
          <h1> @{friend.user_a_name}</h1>
        )}

        {friend.user_a === profile_id && isString(friend?.user_b_email) && (
          <h2 className="flex gap-2 items-center">
            <Mail className="h-4 w-4" />
            {friend.user_b_email}
          </h2>
        )}

        {friend.user_b === profile_id && isString(friend?.user_a_email) && (
          <h2 className="flex gap-2 items-center">
            <Mail className="h-4 w-4" />
            {friend.user_a_email}
          </h2>
        )}

        {/* <h2>joined: {relativeDate(profile.created)}</h2> */}
      </div>
      <div className="text-red-400 hover:bg-accent-foreground">
        <FollowButton pb={pb} friend={friend} me={me} profile_id={profile_id} />
      </div>
    </Link>
  );
}

interface FollowButtonProps {
  pb: PocketBaseClient;
  friend: PocketbookFriendshipResponse;
  profile_id: string;
  me: PocketbookUserResponse;
}

export function FollowButton({ pb,friend, me,profile_id }: FollowButtonProps) {
  type UseMutReturn = Awaited<ReturnType<typeof updateFriendship>>;
  type UseMutParams = Awaited<Parameters<typeof updateFriendship>>[0];

  const follow_mutation = useMutation<
    UseMutReturn,
    Error,
    UseMutParams,
    unknown
  >({
    mutationFn: (vars) => updateFriendship(vars),
    meta: {
      invalidates: ["profile","custom_follower", "custom_following"],
    },
  });

  const am_user_a = me.id === friend.user_a;
  const follow_user = am_user_a
    ? { user_a_follow_user_b: "yes" } as const
    : { user_b_follow_user_a: "yes" } as const

  const unfollow_user = am_user_a
    ? { user_a_follow_user_b: "no" } as const
    : { user_b_follow_user_a: "no" } as const

  const followed_by_me = ()=>{
    if(friend.user_a === me.id && friend.user_b === profile_id){
      return friend.user_a_follow_user_b
    }
    if(friend.user_b === me.id && friend.user_a === profile_id){
      return friend.user_b_follow_user_a
    }
    return "no"
  }  
  const [am_following, setFollowing] = useState(
    followed_by_me() !== "no"
  );

  if (followed_by_me() === "no") {
    return (
      <AsyncButton
        is_loading={follow_mutation.isPending}
        disabled={follow_mutation.isPending}
        className="text-red-400"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          follow_mutation.mutate({
            pb,
            friendship: follow_user,
            friendship_id: friend.id,
          });
          setFollowing(!am_following);
        }}
      >
        {am_following ? "Unfollow" : "Follow back"}
      </AsyncButton>
    );
  } else {
    return (
      <AsyncButton
        is_loading={follow_mutation.isPending}
        disabled={follow_mutation.isPending}
        className="text-red-400"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          follow_mutation.mutate({
            pb,
            friendship: unfollow_user,
            friendship_id: friend.id,
          });
          setFollowing(!am_following);
        }}
      >
        {am_following ? "Unfollow" : "follow"}
      </AsyncButton>
    );
  }
}
