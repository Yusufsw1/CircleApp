import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { Thread } from "@/contex/ThreadContex";
import { getAllThreads } from "@/services/Services";

export default function Feed() {
  // const { threads } = useThread();
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      const result = await getAllThreads();
      console.log(result.data.data.threads);

      setThreads(result.data.data.threads);
    };

    initializeData();
    const socket = io("http://localhost:3000");

    socket.on("new-result", (data) => {
      setThreads((prev) => [data, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="space-y-4">
      {threads.map((t) => (
        <Card className="bg-neutral-900 border-neutral-800 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={t.user?.profile_picture || undefined} />
                <AvatarFallback>{t.user?.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>

              <div>
                <p className="font-semibold">{t.user.name || t.user.full_name}</p>
                <p className="text-neutral-400 text-xs">@{t.user?.username}</p>
              </div>
            </div>

            <p className="text-neutral-200 mb-4">{t.content}</p>
            <div className="">
              {t.image && (
                <div className="m-5">
                  <img
                    className=""
                    src={`http://localhost:3000/${t.image}`}
                    onError={(e) => {
                      console.error("Gagal memuat Gambar", t.image);
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-6 text-neutral-400 text-sm">
              <span className="flex items-center gap-1">❤️ {t.likes}</span>

              <span className="flex items-center gap-1">💬 {t.reply}</span>

              {t.isLiked ? <span className="text-red-500 font-medium">Liked</span> : <span className="text-neutral-300">Like</span>}
            </div>
          </CardContent>
        </Card>
      ))}
      <Separator className="my-4 bg-neutral-800" />
    </div>
  );
}
