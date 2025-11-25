import type { Reply } from "@/types/Type";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { io } from "socket.io-client";
import { useThread } from "@/hooks/useThread";
import type { QueryParams } from "@/services/Services";

export default function ReplayDetail() {
  //   const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [replay, setReplay] = useState<Reply[]>([]);
  const { id } = useParams<{ id: string }>();
  const { getReplies } = useThread();
  const thread_id = parseInt(id!, 10);

  useEffect(() => {
    const params: QueryParams = {
      thread_id,
    };

    const initializeData = async () => {
      const result = await getReplies(params);
      setReplay(result);
      console.log(result);
    };

    initializeData();
    const socket = io("http://localhost:3000");

    socket.on("new-reply", (data) => {
      if (data.thread_id === thread_id) {
        setReplay((prev) => [data.reply, ...prev]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  console.log(replay);

  return (
    <div className="space-y-3 pl-4 border-l border-neutral-700">
      {replay.map((r) => (
        <Card key={r.id} className="bg-neutral-800 border-neutral-700 text-white">
          <CardContent className="flex gap-3">
            <Avatar className="w-8 h-8  ">
              <AvatarImage className="rounded-full object-cover" src={`http://localhost:3000/${r.user.profile_picture}`} />
              <AvatarFallback>{r.user.full_name}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{r.user.username}</p>
              <p className="text-neutral-300 text-sm">{r.content}</p>
              <div className="">
                {r.image && (
                  <div className="m-5">
                    <img
                      className=""
                      src={`http://localhost:3000/${r.image}`}
                      onError={(e) => {
                        console.error("Gagal memuat Gambar", r.image);
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
              <p className="text-neutral-500 text-xs">{new Date(r.created_at).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
