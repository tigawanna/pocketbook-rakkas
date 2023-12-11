"use client";
import { SidePanel } from "@/components/posts/timeline/SidePanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shadcn/ui/tabs";
import { PBUserRecord } from "@/state/models/user/types";
import { InfiniteFriends } from "./friends/InfiniteFriends";
import { RootTimeline } from "@/components/posts/timeline/RootTimeline";

interface ProfileTabsProps {
profile_id:string; 
profile_posts_key: readonly ["custom_posts", string];
followers_count: number | undefined
following_count: number | undefined
}

export function ProfileTabs({
  profile_id,
  profile_posts_key,
  followers_count,
  following_count
}: ProfileTabsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full flex sticky top-2 z-50">
        <TabsTrigger value="posts" className="w-full">
          Posts
        </TabsTrigger>
        <TabsTrigger value="following" className="w-full flex gap-1">
          Following{" "}
          {following_count && <div className="text-xs">{following_count}</div>}
        </TabsTrigger>
        <TabsTrigger value="followers" className="w-full flex gap-1">
          Followers{" "}
          {followers_count && <div className="text-xs">{followers_count}</div>}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="flex">
        <RootTimeline profile={profile_id} />

        <div className="hidden lg:flex h-full w-[50%] m-2 p-2 sticky top-[10%]">
          <SidePanel />
        </div>
      </TabsContent>

      <TabsContent value="followers">
        <InfiniteFriends type={"followers"} profile_id={profile_id} />
      </TabsContent>

      <TabsContent value="following">
        <InfiniteFriends type={"following"} profile_id={profile_id} />
      </TabsContent>
    </Tabs>
  );
}
