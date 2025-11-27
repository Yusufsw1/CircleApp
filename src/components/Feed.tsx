import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Image as ImageIcon } from "lucide-react";
import { useThread } from "@/hooks/useThread";

export default function Feed() {
  const { threads, loadThreads, toggleLike } = useThread();
  const navigate = useNavigate();
  const [processingLikes, setProcessingLikes] = useState<number[]>([]);

  useEffect(() => {
    loadThreads();

    const socket = io("http://localhost:3000");
    socket.on("new-result", loadThreads);
    socket.on("like-updated", console.log);

    return () => socket.disconnect();
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

  return (
    <div className="space-y-3">
      {threads.map((t) => (
        <Card key={t.id} className="bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800/50 transition-colors">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="w-8 h-8 border border-neutral-700">
                <AvatarImage src={`http://localhost:3000/${t.user.photo_profile}`} />
                <AvatarFallback className="text-xs">{t.user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">{t.user.full_name}</p>
                  <span className="text-neutral-400">•</span>
                  <p className="text-neutral-400 text-xs truncate">@{t.user.username}</p>
                </div>
                <p className="text-neutral-500 text-xs mt-0.5">{new Date(t.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Content */}
            <div className="ml-11">
              <p className="text-neutral-200 text-sm mb-3 leading-relaxed">{t.content}</p>

              {t.image && (
                <div className="mb-3 rounded-lg overflow-hidden border border-neutral-700">
                  <img src={`http://localhost:3000/${t.image}`} alt="Thread image" className="w-full h-auto max-h-80 object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 text-neutral-400">
                <button
                  onClick={() => handleLikeClick(t.id, t.userLiked)}
                  disabled={processingLikes.includes(t.id)}
                  className={`flex items-center gap-1.5 transition-colors ${processingLikes.includes(t.id) ? "opacity-50 cursor-not-allowed" : "hover:text-red-400"}`}
                >
                  <Heart className={t.userLiked ? "text-red-500 fill-red-500" : "text-current"} size={18} />
                  <span className="text-xs">{t.likes}</span>
                </button>

                <button onClick={() => navigate(`thread/${t.id}`)} className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-xs">{t.reply}</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Separator className="bg-neutral-800" />
    </div>
  );
}
