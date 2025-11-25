// import { Separator } from "@/components/ui/separator";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import type { Thread } from "@/types/Type";
// import { getAllThreads } from "@/services/Services";
// import { useNavigate } from "react-router-dom";
// import { Heart, MessageSquareText } from "lucide-react";
// import { useThread } from "@/hooks/useThread";

// export default function Feed() {
//   const [threads, setThreads] = useState<Thread[]>([]);
//   const navigate = useNavigate();
//   const { handleLike, handleUnlike } = useThread();

//   useEffect(() => {
//     const initializeData = async () => {
//       const result = await getAllThreads();
//       console.log(result.data.data.threads);

//       setThreads(result.data.data.threads);
//     };

//     initializeData();
//     const socket = io("http://localhost:3000");

//     socket.on("new-result", (data) => {
//       setThreads((prev) => [data, ...prev]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);
//   console.log(threads);

//   return (
//     <div className="space-y-4">
//       {threads.map((t) => (
//         <Card key={t.id} className="bg-neutral-900 border-neutral-800 text-white">
//           <CardContent className="p-4">
//             <div className="flex items-center gap-3 mb-3">
//               <Avatar className="w-10 h-10">
//                 <AvatarImage src={t.user?.profile_picture || undefined} />
//                 <AvatarFallback>{t.user?.username[0].toUpperCase()}</AvatarFallback>
//               </Avatar>

//               <div>
//                 <p className="font-semibold">{t.user.name || t.user.full_name}</p>
//                 <p className="text-neutral-400 text-xs">@{t.user?.username}</p>
//               </div>
//             </div>

//             <p className="text-neutral-200 mb-4 mt-6">{t.content}</p>
//             <div className="">
//               {t.image && (
//                 <div className="m-5">
//                   <img
//                     className=""
//                     src={`http://localhost:3000/${t.image}`}
//                     onError={(e) => {
//                       console.error("Gagal memuat Gambar", t.image);
//                       (e.target as HTMLImageElement).style.display = "none";
//                     }}
//                   />
//                 </div>
//               )}
//             </div>
//             <div className="flex items-center gap-6 text-neutral-400 text-sm">
//               <button onClick={() => (t.userLiked ? handleUnlike(t.id) : handleLike(t.id))}>
//                 <Heart className={t.userLiked ? "text-red-500" : "text-gray-400"} />
//               </button>
//               {t.likes}

//               <MessageSquareText onClick={() => navigate(`thread/${t.id}`)} />
//               <span>{t.replies}</span>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//       <Separator className="my-4 bg-neutral-800" />
//     </div>
//   );
// }

import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Heart, MessageSquareText } from "lucide-react";
import { useThread } from "@/hooks/useThread";

export default function Feed() {
  const { threads, loadThreads, toggleLike } = useThread();
  const navigate = useNavigate();

  useEffect(() => {
    loadThreads(); // 🔥 AMBIL THREAD DARI CONTEXT

    const socket = io("http://localhost:3000");

    socket.on("new-result", (data) => {
      loadThreads(); // ⬅️ auto refresh feed
    });

    return () => socket.disconnect();
  }, []);
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
            <p className="text-neutral-500 text-xs mb-3">{new Date(t.created_at).toLocaleString()}</p>
            <div className="flex items-center gap-6 text-neutral-400 text-sm">
              <button onClick={() => toggleLike(t.id, t.userLiked)}>
                <Heart className={t.userLiked ? "text-red-500" : "text-gray-400"} />
              </button>
              {t.likes}

              <MessageSquareText onClick={() => navigate(`thread/${t.id}`)} />
              <span>{t.reply}</span>
            </div>
          </CardContent>
        </Card>
      ))}

      <Separator className="my-4 bg-neutral-800" />
    </div>
  );
}
