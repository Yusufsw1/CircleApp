import type { Reply } from "@/types/Type";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { io } from "socket.io-client";
import { useThread } from "@/hooks/useThread";
import type { QueryParams } from "@/services/Services";

export default function ReplayDetail() {
  const [replay, setReplay] = useState<Reply[]>([]);
  const { id } = useParams<{ id: string }>();
  const { getReplies } = useThread();
  const thread_id = parseInt(id!, 10);

  useEffect(() => {
    const params: QueryParams = { thread_id };

    const initializeData = async () => {
      const result = await getReplies(params);
      setReplay(result);
    };

    initializeData();

    const socket = io("http://localhost:3000");
    socket.on("new-reply", (data) => {
      if (data.thread_id === thread_id) {
        setReplay((prev) => [data.reply, ...prev]);
      }
    });

    return () => socket.disconnect();
  }, []);
  console.log(replay);

  return (
    <div className="space-y-3">
      {replay.map((r) => (
        <Card key={r.id} className="bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800/50 transition-colors">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="w-7 h-7 border border-neutral-700">
                <AvatarImage src={`http://localhost:3000/${r.user.profile_picture}`} />
                <AvatarFallback className="text-xs">{r.user.full_name}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">{r.user.full_name}</p>
                  <span className="text-neutral-400">•</span>
                  <p className="text-neutral-400 text-xs truncate">@{r.user.username}</p>
                </div>
                <p className="text-neutral-500 text-xs mt-0.5">{new Date(r.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Content */}
            <div className="ml-10">
              <p className="text-neutral-200 text-sm mb-3 leading-relaxed">{r.content}</p>

              {r.image && (
                <div className="mb-2 rounded-lg overflow-hidden border border-neutral-700">
                  <img
                    src={`http://localhost:3000/${r.image}`}
                    alt="Reply image"
                    className="w-full h-auto max-h-64 object-cover"
                    onError={(e) => {
                      console.error("Gagal memuat Gambar", r.image);
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
