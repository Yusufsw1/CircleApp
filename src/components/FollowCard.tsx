import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useFollows } from "@/contex/FollowContext";

export default function FollowCard() {
  const { toggleFollow } = useFollows();
  const { profile } = useProfile();

  return (
    <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={`http://localhost:3000/${user.photo_profile}`} />
          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>

        <div>
          <p className="font-semibold">{user.full_name}</p>
          <p className="text-neutral-400 text-sm">@{user.username}</p>
        </div>
      </div>

      <Button onClick={() => toggleFollow(user.id, user.is_following)} className={`px-4 py-2 rounded-xl ${user.is_following ? "bg-neutral-800 hover:bg-neutral-700" : "bg-white text-black hover:bg-neutral-300"}`}>
        {user.is_following ? "Following" : "Follow"}
      </Button>
    </div>
  );
}
