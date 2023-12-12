import { PocketBaseClient } from "@/lib/pb/client";
import {
  CreateFrienshipMutaionProps,
  UpdateFriendShipMutationProps,
} from "./types";
import { and, expand, or } from "typed-pocketbase";


export async function getFollowingCount(pb: PocketBaseClient, user_id: string) {
  // console.log("user id  == ",user_id)

  try {
    const resultList = await pb
      .collection("pocketbook_friends")
      .getList(1,1, {
        // `
        //           user_a.id="${user_id}"&&user_a_follow_user_b="yes"
        //           ||
        //           user_b.id="${user_id}"&&user_b_follow_user_a="yes"`
        // expand: "user_a,user_b",
        filter:or(
        and(["user_a.id","=",user_id],["user_a_follow_user_b","=","yes"]),
        and(["user_b.id","=",user_id],["user_b_follow_user_a","=","yes"])
        ),
        expand:expand({
          user_a:true,
          user_b:true
        })

      });

    return resultList.totalItems;
  } catch (error: any) {
    console.log("error getting following", error);
    // return new Error(error);
    throw error;
  }
}

export async function getFollowerscount(pb: PocketBaseClient, user_id: string) {
  // console.log("user id  == ",user_id)
  try {
    const resultList = await pb
      .collection("pocketbook_friends")
      .getList(1,1, {
        // filter: `
        //     user_a.id="${user_id}"&&user_b_follow_user_a="yes"
        //     ||
        //     user_b.id="${user_id}"&&user_a_follow_user_b="yes"`,
        // expand: "user_a,user_b",
        filter: or(
          and(["user_a.id", "=", user_id], ["user_b_follow_user_a", "=", "yes"]),
          and(["user_b.id", "=", user_id], ["user_a_follow_user_b", "=", "yes"])
        ),
        expand: expand({
          user_a: true,
          user_b: true
        })
      });

    return resultList.totalItems;
  } catch (error: any) {
    console.log("error getting followers", error);
    // return new Error(error);
    throw error;
  }
}




