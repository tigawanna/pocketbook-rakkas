import { ErrorOutput } from "@/components/wrappers/ErrorOutput";
import { Button } from "@/components/shadcn/ui/button";
import { ExternalLink, Mail } from "lucide-react";
import { PocketbookUserResponse } from "@/lib/pb/db-types";
import { Icons } from "@/components/icons/Iconts";
import { DialogWrapper } from "@/components/pocketbook/dialog/DialodWrapper";
import { relativeDate } from "@/utils/helpers/date";
import { ProfileForm } from "@/routes/profile/components/ProfileForm";
import { Link } from "rakkasjs";
import { isString } from "@/utils/helpers/string";

interface ProfileUserInfoProps {
  data: PocketbookUserResponse;
  logged_in_user: PocketbookUserResponse;
}

export function ProfileUserInfo({
  data,
  logged_in_user,
}: ProfileUserInfoProps) {
  if (data instanceof Error) {
    return (
      <div className="min-h-screen h-full w-full flex items-center justify-center">
        <ErrorOutput error={data} />
      </div>
    );
  }
  const profile_user = data;
  return (
    <div
      className="w-full flex flex-col md:flex-row items-center justify-center bg-base-300 p-3 gap-2 
          "
    >
      <div className="md:w-[35%] w-[90%] p-2 h-full flex items-center justify-center rounded-2xl">
        {profile_user.avatar !== "" && (
          <img
            src={profile_user.avatar}
            alt="user image"
            height={150}
            width={150}
            className="rounded-full h-auto  aspect-square object-cover flex items-center justify-center"
          />
        )}
      </div>

      <div className="w-full h-full flex flex-col items-cente justify-center text-sm ">
        <h1> @{profile_user.username}</h1>
        {profile_user.email !== "" && (
          <h2 className="flex gap-2 items-center">
            <Mail className="h-4 w-4" />
            {profile_user.email}
          </h2>
        )}
        {profile_user.github_login !== "" && (
          <span className="flex gap-2  items-center hover:text-accent">
            <Icons.gitHub  className="h-4 w-4" />
            <Link
              href={`https://github.com/${profile_user.github_login}`}
              target="_blank"
            >
              {profile_user.github_login}
            </Link>
            <ExternalLink className="w-4 h-4" />
          </span>
        )}
        <h2>joined: {relativeDate(profile_user.created)}</h2>
        {isString(profile_user.bio) && (
          <p className="border-t my-1 py-2 ">bio: {profile_user.bio}</p>
        )}
      </div>
      {profile_user && profile_user.id === logged_in_user.id ? (
        <DialogWrapper>
          <ProfileForm user={profile_user} />
        </DialogWrapper>
      ) : (
        <Button 
        className="border bg-accent hover:border-accent-foreground hover:text-accent-foreground">
          Follow/Unfollow : fix me
        </Button>
      )}
    </div>
  );
}
