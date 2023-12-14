import { Button } from "@/components/shadcn/ui/button";
import { PocketBaseClient } from "@/lib/pb/client";
import { PocketbookUserResponse } from "@/lib/pb/db-types";
import { CustomPocketbookFriend } from "@/lib/pb/models/custom_routes/types";
import { useUser } from "@/lib/rakkas/hooks/useUser";
import { tryCatchWrapper } from "@/utils/helpers/async";
import { useQuery,useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";
import { and, or } from "typed-pocketbase";

interface WaterfalssFollowButtonProps {
  pb: PocketBaseClient;
  friend: CustomPocketbookFriend;
  profile_id: string;
  me: PocketbookUserResponse;
}

export function WaterfallssFollowButton({friend,me,profile_id,pb}:WaterfalssFollowButtonProps){
  const friend_button_key = ["profile", "friendship" ,friend.friendship_id] as const
    const query = useQuery({
        queryKey: friend_button_key,
        queryFn: () => {
            return tryCatchWrapper(pb.collection("pocketbook_friends").getFirstListItem(or(
                and(["user_a", "=", me.id], ["user_b.id", "=", profile_id]),
                and(["user_b", "=", me.id], ["user_a.id", "=", profile_id]),
            ),{
                $cancelKey: friend_button_key.join(",")
            })
            )
        },

    })
const data = query.data?.data
const am_user_a = profile_id === friend.user_a;
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


  console.log("data === ",data)
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
  const create_follow_mutation = useMutation({
    mutationFn: () => {
      return pb.collection("pocketbook_friends").create(create_follow_user);
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


  if (query.isPending) {
    return (
      <Button className="animate-pulse">
        ...
    </Button>
    );
  }
  if (!data) {
    return (
      <Button onClick={() => create_follow_mutation.mutate()} className="text-green-500">
        follow{" "}
        {unfollow_mutation.isPending && <Loader className="animate-spin" />}
      </Button>
    );
  }
return (
 <div className='w-full h-full flex items-center justify-center'>

 </div>
);
}
