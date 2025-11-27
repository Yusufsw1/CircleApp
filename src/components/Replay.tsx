import type { Reply } from "@/types/Type";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <div className="space-y-3  border-neutral-700">
      {replay.map((r) => (
        <Card key={r.id} className="bg-neutral-800 border-neutral-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-8 h-8  ">
                <AvatarImage className="" src={`http://localhost:3000/${r.user.profile_picture}`} />
                <AvatarFallback>{r.user.full_name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="">
                <p className=" font-semibold text-sm">{r.user.full_name}</p>
                <p className="text-neutral-400 text-xs">@{r.user.username}</p>
              </div>
            </div>
            <p className="text-neutral-200 mb-4 mt-6 text-md">{r.content}</p>
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
              <p className="text-neutral-500 text-xs">{new Date(r.created_at).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
