import { PageProps } from "rakkasjs";
import { ProfileUserInfo } from "./components/ProfileUserInfo";
import { useUser } from "@/lib/rakkas/hooks/useUser";
import { useQueries, useQuery } from "@tanstack/react-query";
import { tryCatchWrapper } from "@/utils/helpers/async";
import { ChevronLeft } from "lucide-react";
import { ProfileTabs } from "./components/ProfileTabs";
import {
  getFollowerscount,
  getFollowingCount,
} from "@/state/models/friends/friends";
import { Suspense } from "react";
export default function ProfilePage({ params }: PageProps) {
  const { user: logged_in, pb } = useUser();
  const profile_query = useQuery({
    queryKey: ["profile", params.id],
    queryFn: () =>
      tryCatchWrapper(pb.collection("pocketbook_user").getOne(params.id)),
  });
  const follower_count_key = ["followers", params.id];
  const following_count_key = ["following", params.id];

  const count_query = useQueries({
    queries: [
      {
        queryKey: follower_count_key,
        queryFn: () => tryCatchWrapper(getFollowerscount(pb, params.id)),
      },
      {
        queryKey: following_count_key,
        queryFn: () => tryCatchWrapper(getFollowingCount(pb, params.id)),
      },
    ],
  });
  const followers_count = count_query[0].data?.data ?? 0;
  const following_count = count_query[1].data?.data ?? 0;

  const profile_user = profile_query.data?.data;
  return (
    <div className="w-full flex flex-col items-center  h-[99vh]  gap-3 overflow-y-scroll">
      <div className="w-full  flex gap-2 items-center sticky top-0 z-50 ">
        {/* <Link href="-1"> */}
        <ChevronLeft
          onClick={() => history?.back()}
          className="h-7 w-7 hover:text-accent-foreground"
          size={10}
        />
        {/* </Link> */}
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>
      {profile_query.isPending ? (
        <div className="w-full ">loading</div>
      ) : (
        <div className="w-full min-h-[200px]">
          {profile_user && (
            <ProfileUserInfo data={profile_user} logged_in_user={logged_in} />
          )}
        </div>
      )}

      {profile_query.isPending ? (
        <div className="w-full ">loading</div>
      ) : (
        <ProfileTabs
          profile_id={params.id}
          followers_count={followers_count}
          following_count={following_count}
        />
      )}
    </div>
  );
}
