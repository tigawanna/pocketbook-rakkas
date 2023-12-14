import { Button } from "@/components/shadcn/ui/button";
import { PocketBaseClient } from "@/lib/pb/client";
import { PocketbookUserResponse } from "@/lib/pb/db-types";
import { CustomPocketbookFriend } from "@/lib/pb/models/custom_routes/types";
import { useMutation,useQueryClient  } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";


interface FollowButtonProps {
  pb: PocketBaseClient;
  friend: CustomPocketbookFriend;
  profile_id: string;
  me: PocketbookUserResponse;
  
}

export function FollowButtons({
  friend,
me,
  pb,
  profile_id,
}: FollowButtonProps) {
  const { followed_by_me, following_me, friendship_exists,friendship_id  } = friend;
  console.log({followed_by_me, following_me,friendship_exists,friendship_id})

  const am_user_a = profile_id === friend.user_a;
  const whatAction = () => {

      if (
        followed_by_me === "no" &&
        following_me !== "no" &&
        friendship_exists !== "no"
      ) {
        return "follow_back";
      }
      if (followed_by_me !== "no" && friendship_exists !== "no") {
        return "unfollow";
      }
      if(followed_by_me === "no"){
        return "follow"
      }
      
      return "follow"
    

  };
    const create_follow_user = am_user_a
      ? ({
          user_a: me.id,
          user_b: friend.user_b,
          user_a_follow_user_b: "yes",
        } as const)
      : ({
          user_a: me.id,
          user_b: friend.user_a,
          user_a_follow_user_b: "yes",
        } as const);
  const follow_user = am_user_a
    ? ({ user_a_follow_user_b: "yes" } as const)
    : ({ user_b_follow_user_a: "yes" } as const);

  const unfollow_user = am_user_a
    ? ({ user_a_follow_user_b: "no" } as const)
    : ({ user_b_follow_user_a: "no" } as const);

const action = whatAction()
// console.log("action === ",action)
  const unfollow_mutation = useMutation({
    mutationFn: () => {
      return pb
        .collection("pocketbook_friends")
        .update(friend.friendship_id, unfollow_user);
    },
    onSuccess: (data) => {
      console.log({data})
    },
    onError: () => {
      toast.error("Error unfollowing");
    },
    meta: {
      invalidates: ["profile"],
    },
  });
  const follow_mutation = useMutation({
    mutationFn: () => {
      // console.log("create_follow_user", create_follow_user);
      return pb
        .collection("pocketbook_friends")
        .update(friendship_exists, follow_user);
    },
    onSuccess: (data) => {
      console.log({ data, friendship_exists });
    },
    onError: () => {
      toast.error("Error unfollowing");
    },
    meta: {
      invalidates: ["profile"],
    },
  });
  const create_follow_mutation = useMutation({
    mutationFn: () => {
      return pb
        .collection("pocketbook_friends")
        .create(create_follow_user);
    },
    onError: () => {
      toast.error("Error creating follow");
    },
    meta: {
      invalidates: ["profile"],
    },
  });
  if(action=== "follow" && friendship_exists ==="no"){
    return (
      <Button onClick={() => create_follow_mutation.mutate()} className="text-green-500">
        Follow {unfollow_mutation.isPending && <Loader className="animate-spin" />}
      </Button>
    );
  }
  if(action=== "unfollow"){
    return (
      <Button onClick={() => unfollow_mutation.mutate()}>
        Unfollow {unfollow_mutation.isPending && <Loader className="animate-spin" />}
      </Button>
    );
  }

  return (
    <Button onClick={() => follow_mutation.mutate()}>
      {action === "follow" && "Follow"}
       {action === "follow_back" && "Follow Back"}{" "}
      {follow_mutation.isPending && <Loader className="animate-spin" />}
    </Button>
  );

}
