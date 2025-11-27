// components/RightSidebar.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import EditProfileModal from "./EditProfileModal";
import Suggested from "./Suggested";

export default function RightSidebar() {
  const { profile } = useProfile();

  if (!profile) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 text-white">
        <CardContent className="p-4">
          <div className="animate-pulse">Loading profile...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-neutral-900 border-neutral-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-14 h-14">
              <AvatarImage src={profile.photo_profile ? `http://localhost:3000/${profile.photo_profile}` : undefined} alt={profile.full_name} />
              <AvatarFallback className="bg-neutral-800">{profile.full_name[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lg truncate">{profile.full_name}</p>
              <p className="text-neutral-400 text-sm truncate">@{profile.username}</p>
            </div>
          </div>

          {profile.bio && <p className="text-neutral-300 text-sm mb-4 line-clamp-2">{profile.bio}</p>}

          <div className="flex items-center gap-4 text-sm text-neutral-400 mb-4">
            <span>
              <strong className="text-white">{profile.following_count}</strong> Following
            </span>
            <span>
              <strong className="text-white">{profile.follower_count}</strong> Followers
            </span>
          </div>
          <EditProfileModal />
        </CardContent>
      </Card>

      <Suggested />
    </div>
  );
}
