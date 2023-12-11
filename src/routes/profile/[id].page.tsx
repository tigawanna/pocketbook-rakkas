import { PageProps } from "rakkasjs"
import { ProfileUserInfo } from "./components/ProfileUserInfo";
import { useUser } from "@/lib/rakkas/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { tryCatchWrapper } from "@/utils/helpers/async";
import { ChevronLeft } from "lucide-react";
export default function ProfilePage({params}:PageProps) {
const { user: logged_in, pb } = useUser();
const profile_query = useQuery({
    queryKey: ["profile", params.id],
    queryFn: () => tryCatchWrapper(pb.collection("pocketbook_user").getOne(params.id)),
})
const profile_user = profile_query.data?.data
return (
  <div className="w-full h-full min-h-screen flex flex-col items-center gap-2">
    <div className="w-full  flex gap-2 items-center sticky top-0  ">
      {/* <Link href="-1"> */}
      <ChevronLeft
        onClick={() => history?.back()}
        className="h-7 w-7 hover:text-accent-foreground"
        size={10}
      />
      {/* </Link> */}
      <h1 className="text-3xl font-bold">Profile</h1>
    </div>
    {profile_user && (
      <ProfileUserInfo data={profile_user} logged_in_user={logged_in} />
    )}
  </div>
);}
