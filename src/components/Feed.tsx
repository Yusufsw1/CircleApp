import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, MessageSquareText } from "lucide-react";
import { useThread } from "@/hooks/useThread";

export default function Feed() {
  const { threads, loadThreads, toggleLike } = useThread();
  const navigate = useNavigate();
  const [processingLikes, setProcessingLikes] = useState<number[]>([]);

  useEffect(() => {
    loadThreads(); // 🔥 AMBIL THREAD DARI CONTEXT

    const socket = io("http://localhost:3000");

    socket.on("new-result", (data) => {
      loadThreads(); // ⬅️ auto refresh feed
    });

    socket.on("like-updated", (data) => {
      console.log("Like updated:", data);
    });

    return () => socket.disconnect();
  }, []);

  const handleLikeClick = async (threadId: number, isCurrentlyLiked: boolean) => {
    // Cegah multiple clicks
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
  console.log(threads);

  return (
    <div className="space-y-4">
      {threads.map((t) => (
        <Card key={t.id} className="bg-neutral-900 border-neutral-800 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={`http://localhost:3000/${t.user.photo_profile}`} />
                <AvatarFallback>{t.user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>

              <div>
                <p className="font-semibold">{t.user.full_name}</p>
                <p className="text-neutral-400 text-xs">@{t.user.username}</p>
              </div>
            </div>

            <p className="text-neutral-200 mb-4 mt-6">{t.content}</p>

            {t.image && (
              <div className="m-5">
                <img src={`http://localhost:3000/${t.image}`} onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
              </div>
            )}
            <div className="flex items-center justify-between text-neutral-400 text-sm">
              <div className="flex items-center gap-1">
                <p className="text-neutral-500 text-xs mb-3">{new Date(t.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4 text-neutral-400 text-sm">
                <button
                  onClick={() => handleLikeClick(t.id, t.userLiked)}
                  disabled={processingLikes.includes(t.id)}
                  className={`flex items-center gap-1 transition-colors ${processingLikes.includes(t.id) ? "opacity-50 cursor-not-allowed" : "hover:text-red-400"}`}
                >
                  <Heart className={t.userLiked ? "text-red-500 fill-red-500" : "text-gray-400"} size={20} />
                  <span>{t.likes}</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageCircle size={18} onClick={() => navigate(`thread/${t.id}`)} />
                  <span>{t.reply}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Separator className="my-4 bg-neutral-800" />
    </div>
  );
}
