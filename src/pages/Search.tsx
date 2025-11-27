import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import api from "@/api/Axios";
import { useFollows } from "@/hooks/useFollow";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { toggleFollow } = useFollows();
  const { profile } = useProfile();

  const handleSearch = async (e: any) => {
    setQuery(e.target.value);
    const text = e.target.value;

    if (text.trim() === "") {
      setResults([]);
      return;
    }

    const res = await api.get("/users/search", { params: { query: text } });
    setResults(res.data.users);
  };
  const handleToggle = async (userId: number, isFollowing: boolean) => {
    await toggleFollow(userId, isFollowing);

    // Update state results (agar UI berubah tanpa reload)
    setResults((prev) => prev.map((u) => (u.id === userId ? { ...u, is_following: !isFollowing } : u)));
  };
  console.log(results);

  return (
    <div className="">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200" asChild>
            <Link to="/home" className="flex items-center gap-2 text-white hover:text-gray-300">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Search</h1>
        </div>
      </div>
      <div className="relative w-full">
        <input value={query} onChange={handleSearch} placeholder="Search users..." className="w-full p-2 rounded-lg bg-neutral-800 text-white" />

        {results.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-neutral-900 border border-neutral-700 rounded-lg mt-2 p-3">
            {results.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-2 hover:bg-neutral-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`http://localhost:3000/${u.photo_profile}`} className="object-cover" />
                    <AvatarFallback className="text-sm bg-neutral-800">{u.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white">{u.full_name}</p>
                    <p className="text-neutral-400">@{u.username}</p>
                  </div>
                </div>

                {profile?.id !== u.id && (
                  <Button
                    onClick={() => handleToggle(u.id, !!u.is_following)}
                    variant={u.is_following ? "outline" : "default"}
                    className={`rounded-full text-xs font-medium transition-all ${
                      u.is_following ? "border-neutral-600 text-white bg-transparent hover:bg-red-500/10 hover:border-red-500 hover:text-red-500" : "bg-white text-black hover:bg-neutral-200"
                    }`}
                  >
                    {u.is_following ? "Following" : "Follow"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
