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
  const { followed_by_me, following_me, friendship_id,  } =
    friend;
console.log({followed_by_me, following_me,})

  const am_user_a = me.id === friend.user_a;
  const whatAction = () => {

      if(followed_by_me ==="no" && following_me !== "no"){
        return "follow_back"
      }
      if(followed_by_me !== "no"){
        return "unfollow"
      }
      if(followed_by_me === "no"){
        return "follow"
      }
      
      return "follow"
    

  };
  const follow_user = am_user_a
    ? ({ user_a_follow_user_b: "yes" } as const)
    : ({ user_b_follow_user_a: "yes" } as const);

  const unfollow_user = am_user_a
    ? ({ user_a_follow_user_b: "no" } as const)
    : ({ user_b_follow_user_a: "no" } as const);

const action = whatAction()
console.log("action === ",action)
  const unfollow_mutation = useMutation({
    mutationFn: () => {
      return pb
        .collection("pocketbook_friends")
        .update(friend.friendship_id, unfollow_user);
    },
    // onSuccess: () => {
    //   toast.success("Unfollowed");
    //   qc.invalidateQueries({ queryKey: ["profile", "followers", "following"] });
    // },
    onError: () => {
      toast.error("Error unfollowing");
    },
    meta: {
      invalidates: ["profile"],
    },
  });
  const follow_mutation = useMutation({
    mutationFn: () => {
      return pb
        .collection("pocketbook_friends")
        .update(friend.friendship_id, follow_user);
    },
    // onSuccess: () => {
    //   toast.success("Unfollowed");
    //   qc.invalidateQueries({ queryKey: ["profile"] });
    // },
    onError: () => {
      toast.error("Error unfollowing");
    },
    meta: {
      invalidates: ["profile"],
    },
  });
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
