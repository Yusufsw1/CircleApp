import { useState } from "react";
import { useThread } from "@/hooks/useThread";
import { createThread } from "@/services/Services";

export default function CreateThreadForm() {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { addThread } = useThread();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("content", content);
    if (imageFile) fd.append("image", imageFile);

    const res = await createThread(fd);

    if (res.data.data.thread) {
      addThread(res.data.data.thread);
    }

    // reset form
    setContent("");
    setImageFile(null);
    setImagePreview(null);

    // window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 bg-neutral-900 rounded-xl shadow-md border border-neutral-800 mb-5">
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's happening?" className="w-full bg-neutral-800 text-white p-3 rounded-lg focus:outline-none resize-none" rows={3} />
      {imagePreview && (
        <div className="mt-3">
          <img src={imagePreview} alt="preview" className="rounded-lg max-h-64 object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <label className="cursor-pointer text-blue-400 hover:text-blue-300">
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          Upload Image
        </label>

        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
          Post
        </button>
      </div>
    </form>
  );
}
