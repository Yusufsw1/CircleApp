import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useFollows } from "@/hooks/useFollow";
import { useProfile } from "@/hooks/useProfile";

export default function FollowsPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const type = (params.get("type") as "followers" | "following") ?? "followers";

  const { list, loadList, toggleFollow } = useFollows();
  const { profile } = useProfile();

  useEffect(() => {
    loadList(type);
  }, [type, loadList]);

  console.log(list);

  return (
    <div>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200" asChild>
            <Link to="/home" className="flex items-center gap-2 text-white hover:text-gray-300">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">{type === "followers" ? "Followers" : "Following"}</h1>
        </div>
      </div>

      <div className="flex gap-6 mb-4 border-b border-neutral-700 pb-2 px-6">
        <Link to="/home/follows?type=followers" className={`px-2 ${type === "followers" ? "font-bold" : ""}`}>
          Followers
        </Link>
        <Link to="/home/follows?type=following" className={`px-2 ${type === "following" ? "font-bold" : ""}`}>
          Following
        </Link>
      </div>

      <div className="space-y-4 p-4">
        {list.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-700 rounded-lg">
            <div className="flex items-center gap-3">
              <img src={user.photo_profile ? `http://localhost:3000/${user.photo_profile}` : ""} className="w-12 h-12 rounded-full object-cover" alt="" onError={(e) => ((e.target as HTMLImageElement).src = "")} />
              <div>
                <p className="font-semibold text-white">{user.full_name}</p>
                <p className="text-neutral-400">@{user.username}</p>
              </div>
            </div>

            {profile?.id !== user.id && (
              <Button onClick={() => toggleFollow(user.id, !!user.is_following)} className={`px-4 py-2 rounded-xl ${user.is_following ? "bg-neutral-800 hover:bg-neutral-700" : "bg-white text-black hover:bg-neutral-300"}`}>
                {user.is_following ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
