import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Users, UserCheck } from "lucide-react";
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 ">
        <Button variant="ghost" className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200" asChild>
          <Link to="/home" className="flex items-center gap-2 text-white hover:text-gray-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">{type === "followers" ? "Followers" : "Following"}</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-neutral-800">
        <Link
          to="/home/follows?type=followers"
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${type === "followers" ? "text-white border-b-2 border-blue-500" : "text-neutral-400 hover:text-neutral-300"}`}
        >
          <Users size={18} />
          Followers
        </Link>
        <Link
          to="/home/follows?type=following"
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${type === "following" ? "text-white border-b-2 border-blue-500" : "text-neutral-400 hover:text-neutral-300"}`}
        >
          <UserCheck size={18} />
          Following
        </Link>
      </div>

      {/* User List */}
      <div className="p-4 space-y-3">
        {list.length === 0 ? (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-400 text-sm">{type === "followers" ? "You don't have any followers yet" : "You're not following anyone yet"}</p>
            </CardContent>
          </Card>
        ) : (
          list.map((user) => (
            <Card key={user.id} className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="w-11 h-11 border border-neutral-700">
                      <AvatarImage src={user.photo_profile ? `http://localhost:3000/${user.photo_profile}` : ""} className="object-cover" />
                      <AvatarFallback className="text-sm bg-neutral-800">{user.username[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{user.full_name}</p>
                      <p className="text-neutral-400 text-xs truncate">@{user.username}</p>
                      {user.bio && <p className="text-neutral-400 text-xs mt-1 truncate">{user.bio}</p>}
                    </div>
                  </div>

                  {profile?.id !== user.id && (
                    <Button
                      onClick={() => toggleFollow(user.id, !!user.is_following)}
                      variant={user.is_following ? "outline" : "default"}
                      size="sm"
                      className={`rounded-full text-xs font-medium transition-all ${
                        user.is_following ? "border-neutral-600 text-white bg-transparent hover:bg-red-500/10 hover:border-red-500 hover:text-red-500" : "bg-white text-black hover:bg-neutral-200"
                      }`}
                    >
                      {user.is_following ? "Following" : "Follow"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
