// components/ProfilePage.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import EditProfileModal from "../components/EditProfileModal";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useThread } from "@/hooks/useThread";

export default function ProfilePage() {
  const { profile, refreshProfile } = useProfile();
  const { threads, loadThreads, toggleLike } = useThread(); // ✅ PAKAI THREADS DARI THREAD CONTEXT
  const [activeTab, setActiveTab] = useState("threads");
  const [processingLikes, setProcessingLikes] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshProfile();
    loadThreads(); // ✅ LOAD SEMUA THREADS (seperti di home page)
  }, []);

  const handleLikeClick = async (threadId: number, isCurrentlyLiked: boolean) => {
    if (processingLikes.includes(threadId)) return;

    setProcessingLikes((prev) => [...prev, threadId]);
    try {
      await toggleLike(threadId, isCurrentlyLiked);
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setProcessingLikes((prev) => prev.filter((id) => id !== threadId));
    }
  };

  const handleThreadClick = (threadId: number) => {
    navigate(`/thread/${threadId}`);
  };

  // ✅ FILTER THREADS BY USER JIKA PERLU (opsional)
  const userThreads = threads.filter((thread) => thread.user.id === profile?.id);
  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="p-6   border-neutral-800">
      {/* Cover Photo */}
      <div className="flex items-center gap-4 mb-6 ">
        <Button variant="ghost" className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200" asChild>
          <Link to="/home" className="flex items-center gap-2 text-white hover:text-gray-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Profile</h1>
      </div>
      <div className="h-48 bg-gradient-to-r from-amber-400 to-amber-700 relative">
        {/* Profile Picture Overlay */}
        <div className="absolute -bottom-16 left-6">
          <Avatar className="w-32 h-32 border-4 border-black">
            <AvatarImage src={profile.photo_profile ? `http://localhost:3000/${profile.photo_profile}` : undefined} alt={profile.full_name} className="object-cover" />
            <AvatarFallback className="text-2xl bg-neutral-800 text-white">{profile.full_name[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-6 pt-20 pb-6">
        {/* Action Button */}
        <div className="flex justify-end mb-6">
          <EditProfileModal />
        </div>

        {/* User Information */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{profile.full_name}</h1>
            <p className="text-neutral-400 text-lg">@{profile.username}</p>
          </div>

          {/* Bio */}
          {profile.bio && <p className="text-neutral-200 text-lg leading-relaxed">{profile.bio}</p>}

          {/* Stats */}
          <div className="flex items-center gap-6 text-neutral-400">
            <span className="hover:text-white cursor-pointer transition-colors">
              <strong className="text-white font-semibold">{profile.following_count}</strong> Following
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              <strong className="text-white font-semibold">{profile.follower_count}</strong> Followers
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              <strong className="text-white font-semibold">{userThreads.length}</strong> Threads
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-neutral-800">
        <div className="px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("my-threads")}
              className={`py-4 px-1 border-b-2 font-medium text-lg transition-colors ${activeTab === "my-threads" ? "border-blue-500 text-white" : "border-transparent text-neutral-400 hover:text-white"}`}
            >
              My Threads
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`py-4 px-1 border-b-2 font-medium text-lg transition-colors ${activeTab === "media" ? "border-blue-500 text-white" : "border-transparent text-neutral-400 hover:text-white"}`}
            >
              Media
            </button>
          </nav>
        </div>
      </div>

      {/* Threads Content */}
      <div className="px-6 py-4 space-y-4">
        {activeTab === "my-threads" && (
          <>
            {userThreads.length === 0 ? (
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-8 text-center">
                  <p className="text-neutral-400 text-lg mb-4">You haven't created any threads yet.</p>
                  <Button onClick={() => navigate("/home")} className="bg-blue-500 hover:bg-blue-600">
                    Create your first thread
                  </Button>
                </CardContent>
              </Card>
            ) : (
              userThreads.map((thread) => (
                <Card key={thread.id} className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer" onClick={() => handleThreadClick(thread.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={thread.user.photo_profile ? `http://localhost:3000/${thread.user.photo_profile}` : undefined} alt={thread.user.full_name} />
                        <AvatarFallback className="text-xs">{thread.user.full_name}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white text-sm">{thread.user.full_name}</p>
                        <p className="text-neutral-400 text-xs">@{thread.user.username}</p>
                      </div>
                    </div>

                    {/* Thread Content */}
                    <p className="text-neutral-200 mb-4">{thread.content}</p>

                    {/* Thread Image */}
                    {thread.image && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={`http://localhost:3000/${thread.image}`}
                          alt="Thread"
                          className="w-full max-h-96 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    {/* Thread Metadata */}
                    <div className="flex items-center justify-between text-neutral-400 text-sm">
                      <div className="flex items-center gap-1">
                        <p className="text-neutral-500 text-xs mb-3">{new Date(thread.created_at).toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeClick(thread.id, thread.userLiked);
                          }}
                          disabled={processingLikes.includes(thread.id)}
                          className={`flex items-center gap-1 transition-colors ${processingLikes.includes(thread.id) ? "opacity-50 cursor-not-allowed" : "hover:text-red-400"}`}
                        >
                          <Heart className={thread.userLiked ? "text-red-500 fill-red-500" : "text-gray-400"} size={20} />
                          <span>{thread.likes}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <MessageCircle size={18} onClick={() => handleThreadClick(thread.id)} />
                          <span>{thread.reply}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}

        {activeTab === "media" && (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-8 text-center">
              <p className="text-neutral-400 text-lg">No media yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
