import { Button } from "@/components/shadcn/ui/button";
import { PocketBaseClient } from "@/lib/pb/client";
import {
  PocketbookFriendshipResponse,
  PocketbookUserResponse,
} from "@/lib/pb/db-types";
import { CustomPocketbookFriend } from "@/lib/pb/models/custom_routes/types";


interface FollowButtonProps {
  pb: PocketBaseClient;
  friend: CustomPocketbookFriend;
  profile_id: string;
  me: PocketbookUserResponse;
}

export function FollowButton({
  friend,
  profile_id,
  me,
  pb,
}: FollowButtonProps) {
  const {followed_by_me,following_me}= friend
  console.log({followed_by_me,following_me})
  const am_user_a = me.id === friend.user_a;
  const follow_user = am_user_a
    ? ({ user_a_follow_user_b: "yes" } as const)
    : ({ user_b_follow_user_a: "yes" } as const);

  const unfollow_user = am_user_a
    ? ({ user_a_follow_user_b: "no" } as const)
    : ({ user_b_follow_user_a: "no" } as const);

  //   const followed_by_me = ({friend,me}:{friend:PocketbookFriendshipResponse,me:PocketbookUserResponse}) => {
  //     if (friend.user_a === me.id && friend.user_b === profile_id) {
  //       return friend.user_a_follow_user_b;
  //     }
  //     if (friend.user_b === me.id && friend.user_a === profile_id) {
  //       return friend.user_b_follow_user_a;
  //     }
  //     return "no";
  //   };
if(followed_by_me==="no" && following_me!=="no"){
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* <Button> Follow </Button>
      <Button> Follow Back</Button>
      <Button> UnFollow </Button> */}
      <Button>Follow back</Button>
    </div>
  );
}
if(followed_by_me!=="no"){
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* <Button> Follow </Button>
      <Button> Follow Back</Button>
      <Button> UnFollow </Button> */}
      <Button>Unfollow</Button>
    </div>
  );
}


  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* <Button> Follow </Button>
      <Button> Follow Back</Button>
      <Button> UnFollow </Button> */}
      <Button>{}</Button>
    </div>
  );
}
