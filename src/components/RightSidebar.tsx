import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import EditProfileModal from "./EditProfileModal";
import Suggested from "./Suggested";

export default function RightSidebar() {
  const { profile } = useProfile();

  if (!profile) return <div>Loading...</div>;

  // const suggested = [
  //   {
  //     name: "Mohammed Jawahir",
  //     username: "em_jawahir",
  //     avatar: "https://randomuser.me/api/portraits/men/21.jpg",
  //   },
  //   {
  //     name: "Shakia Kimathi",
  //     username: "shakiakim",
  //     avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  //   },
  //   {
  //     name: "Naveen Singh",
  //     username: "naveeeen",
  //     avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  //   },
  // ];
  console.log(profile);

  return (
    <div className="fixed flex flex-col gap-6">
      <Card className="bg-neutral-900 border-neutral-800 text-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={`http://localhost:3000/${profile.photo_profile}`} />
              <AvatarFallback>{profile.username}</AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold">{profile.full_name}</p>
              <p className="text-neutral-400 text-sm">@{profile.username}</p>
            </div>
          </div>
          <p className="text-neutral-400 text-sm">{profile.bio}</p>
          <div className="flex items-center gap-3">
            Follower <p className="text-neutral-400 text-sm">{profile.follower_count}</p>
            Following <p className="text-neutral-400 text-sm">{profile.following_count}</p>
          </div>
          {/* <Button className="w-full mt-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl"> */}
          <EditProfileModal />
          {/* </Button> */}
        </CardContent>
      </Card>

      <Suggested />

      {/* <Card className="bg-neutral-900 border-neutral-800 text-white">
        <CardContent className="p-4">
          <p className="font-semibold mb-3">Suggested for you</p>

          <div className="flex flex-col gap-4">
            {suggested.map((s, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={s.avatar} />
                    <AvatarFallback>{s.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-neutral-400 text-sm">@{s.username}</p>
                  </div>
                </div>

                <Button variant="secondary" className="bg-neutral-800 hover:bg-amber-50">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
