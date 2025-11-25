import { getSuggestedService } from "@/services/Services";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { useFollows } from "@/hooks/useFollow";
import { useProfile } from "@/hooks/useProfile";

export default function Suggested() {
  const [suggested, setSuggested] = useState([]);
  const { toggleFollow } = useFollows();
  const { profile } = useProfile();

  const handleToggle = async (userId: number, isFollowing: boolean) => {
    await toggleFollow(userId, isFollowing);

    setSuggested((prev) => prev.filter((p) => p.id !== userId));
  };
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const users = await getSuggestedService();
        setSuggested(users);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuggested();
  }, []);
  console.log(suggested);

  return (
    <Card className="bg-neutral-900 border-neutral-800 text-white">
      <CardContent className="p-4">
        <p className="font-semibold mb-3">Suggested for you</p>
        <div className="flex flex-col gap-4">
          {suggested.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`http://localhost:3000/${s.photo_profile}`} />
                  <AvatarFallback>{s.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{s.full_name}</p>
                  <p className="text-neutral-400 text-sm">@{s.username}</p>
                </div>
              </div>

              {profile?.id !== s.id && (
                <Button onClick={() => handleToggle(s.id, !!s.is_following)} className={`${s.is_following ? "bg-neutral-800 hover:bg-neutral-700" : "bg-white text-black hover:bg-neutral-300"}`}>
                  {s.is_following ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
