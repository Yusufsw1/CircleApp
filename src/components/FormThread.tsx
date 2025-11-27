import { useState } from "react";
import { useThread } from "@/hooks/useThread";
import { createThread } from "@/services/Services";
import { Image, X } from "lucide-react";

export default function CreateThreadForm() {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addThread } = useThread();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("content", content);
      if (imageFile) fd.append("image", imageFile);

      const res = await createThread(fd);

      if (res.data.data.thread) {
        addThread(res.data.data.thread);
      }

      // Reset form
      setContent("");
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating thread:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 bg-neutral-900 rounded-xl border border-neutral-800 mb-4">
      {/* Textarea */}
      <div className="mb-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full bg-neutral-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm placeholder-neutral-400"
          rows={2}
        />
      </div>

      {/* Image Preview */}
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

      {/* Bottom Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label className="cursor-pointer text-blue-400 hover:text-blue-300 transition-colors p-1.5 rounded hover:bg-neutral-800">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <Image size={18} />
          </label>
        </div>

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
            <span>Post</span>
          )}
        </button>
      </div>
    </form>
  );
}
