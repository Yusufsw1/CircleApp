import { useThread } from "@/hooks/useThread";
import { ArrowLeft, Heart, MessageCircle, Image as ImageIcon, X } from "lucide-react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadThreadById(thread_id);
  }, [thread_id]);

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

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;

    setIsSubmitting(true);

    const rp = new FormData();
    rp.append("content", content);
    if (imageFile) rp.append("image", imageFile);

    try {
      await addReply({ thread_id }, rp);
      setContent("");
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Reply error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!thread) return <p className="text-white text-center p-8">Loading...</p>;

  return (
    <div className=" p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" className="p-2 hover:bg-neutral-800 rounded-full transition-colors" asChild>
          <Link to="/home" className="flex items-center text-white hover:text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-white">Status</h1>
      </div>

      {/* Main Thread */}
      <Card className="bg-neutral-900 border-neutral-800 text-white mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="w-9 h-9 border border-neutral-700">
              <AvatarImage src={`http://localhost:3000/${thread.user.photo_profile}`} />
              <AvatarFallback className="text-sm">{thread.user.full_name}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm truncate">{thread.user.full_name}</p>
                <span className="text-neutral-400">•</span>
                <p className="text-neutral-400 text-xs truncate">@{thread.user.username}</p>
              </div>
              <p className="text-neutral-500 text-xs mt-0.5">{new Date(thread.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="ml-12">
            <p className="text-neutral-200 text-sm mb-3 leading-relaxed">{thread.content}</p>

            {thread.image && (
              <div className="mb-3 rounded-lg overflow-hidden border border-neutral-700">
                <img src={`http://localhost:3000/${thread.image}`} alt="thread" className="w-full h-auto max-h-96 object-cover" />
              </div>
            )}

            <div className="flex items-center gap-6 text-neutral-400">
              <button
                onClick={handleLikeClick}
                disabled={processingLikes.includes(thread.id)}
                className={`flex items-center gap-1.5 transition-colors ${processingLikes.includes(thread.id) ? "opacity-50 cursor-not-allowed" : "hover:text-red-400"}`}
              >
                <Heart className={thread.userLiked ? "text-red-500 fill-red-500" : "text-current"} size={18} />
                <span className="text-xs">{thread.likes}</span>
              </button>

              <div className="flex items-center gap-1.5 text-current">
                <MessageCircle size={18} />
                <span className="text-xs">{thread.reply}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      <Card className="bg-neutral-900 border-neutral-800 mb-4">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tambahkan komentar..."
              className="w-full bg-neutral-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm placeholder-neutral-400 mb-3"
              rows={2}
            />

            {imagePreview && (
              <div className="relative mb-3 inline-block">
                <div className="relative">
                  <img src={imagePreview} alt="preview" className="rounded-lg max-h-48 object-cover border border-neutral-700" />
                  <button type="button" onClick={removeImage} className="absolute top-1 right-1 bg-black/80 hover:bg-black text-white p-1 rounded-full transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="cursor-pointer text-blue-400 hover:text-blue-300 transition-colors p-1.5 rounded hover:bg-neutral-800">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <ImageIcon size={18} />
              </label>

              <button
                type="submit"
                disabled={(!content.trim() && !imageFile) || isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <span>Reply</span>
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Replies */}
      <ReplayDetail />
    </div>
  );
}
