import { useThread } from "@/hooks/useThread";
import { ArrowLeft, Heart, MessageCircle, MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReplayDetail from "../components/Replay";

export default function ThreadDetail() {
  const { id } = useParams();
  const thread_id = Number(id);

  const { loadThreadById, getThreadById, toggleLike, addReply } = useThread();

  const thread = getThreadById(thread_id);

  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processingLikes, setProcessingLikes] = useState<number[]>([]);

  const handleLikeClick = async () => {
    if (!thread || processingLikes.includes(thread.id)) return;

    setProcessingLikes((prev) => [...prev, thread.id]);

    try {
      await toggleLike(thread.id, thread.userLiked);
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setProcessingLikes((prev) => prev.filter((id) => id !== thread.id));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    loadThreadById(thread_id); // 🟢 load jika belum ada
  }, [thread_id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const rp = new FormData();
    rp.append("content", content);
    if (imageFile) rp.append("image", imageFile);

    await addReply({ thread_id }, rp);

    setContent("");
    setImageFile(null);
    setImagePreview(null);
  };

  if (!thread) return <p>Loading...</p>;
  console.log(thread);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200" asChild>
          <Link to="/home" className="flex items-center gap-2 text-white hover:text-gray-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Status</h1>
      </div>

      <Card className="bg-neutral-900 border-neutral-800 text-white mb-4">
        <CardContent>
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage className="rounded-full object-cover" src={`http://localhost:3000/${thread.user.photo_profile}`} />
              <AvatarFallback>{thread.user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold">{thread.user.full_name}</p>
              <p className="text-neutral-400 text-xs">@{thread.user.username}</p>
            </div>
          </div>
          <p className="text-neutral-200 mb-4 text-1xl">{thread.content}</p>

          {thread.image && (
            <div className="m-5">
              <img src={`http://localhost:3000/${thread.image}`} alt="thread" />
            </div>
          )}
          <p className="text-neutral-500 text-xs mb-3">{new Date(thread.created_at).toLocaleString()}</p>
          <div className="flex items-center gap-6 text-neutral-400 text-sm">
            <button
              onClick={() => toggleLike(thread.id, thread.userLiked)}
              disabled={processingLikes.includes(thread.id)}
              className={`flex items-center gap-1 ${processingLikes.includes(thread.id) ? "opacity-50 cursor-not-allowed" : "hover:text-red-400"}`}
            >
              <Heart className={thread.userLiked ? "text-red-500 fill-red-500" : "text-gray-400"} size={20} />
              <span>{thread.likes}</span>
            </button>

            <div className="flex items-center gap-1">
              <MessageCircle size={20} />
              <span>{thread.reply}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="px-4 mb-6">
        <div className="flex gap-3">
          <form onSubmit={handleSubmit} className="w-full p-4 bg-neutral-900 rounded-xl shadow-md border border-neutral-800 mb-5">
            {/* Input Text */}
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tambahkan komentar" className="w-full bg-neutral-800 text-white p-3 rounded-lg focus:outline-none resize-none" rows={3} />
            {/* Preview Gambar */}

            {imagePreview && (
              <div className="mt-3">
                <img src={imagePreview} alt="preview" className="rounded-lg max-h-64 object-cover" />
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              {/* Upload Button */}
              <label className="cursor-pointer text-blue-400 hover:text-blue-300">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                Upload Image
              </label>

              {/* Post Button */}
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
      <ReplayDetail />
    </div>
  );
}
