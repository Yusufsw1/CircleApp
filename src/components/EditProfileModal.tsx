import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";

export default function EditProfileModal() {
  const { profile, updateProfile } = useProfile();

  const [fullName, setFullName] = useState(profile.full_name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || "");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(profile.photo_profile);

  const handleFile = (e: any) => {
    const f = e.target.files[0];
    setImage(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append("full_name", fullName);
    fd.append("username", username);
    fd.append("bio", bio);
    if (image) fd.append("photo_profile", image);

    await updateProfile(fd);
    alert("Profile updated!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full mt-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl">Edit Profile</Button>
      </DialogTrigger>

      <DialogContent className="bg-neutral-900 text-white border-neutral-700">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <img src={preview || ""} className="w-20 h-20 rounded-full object-cover" />
          </div>

          <Input className="cursor-pointer text-blue-400 hover:text-blue-300" type="file" onChange={handleFile} />

          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />

          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-blue-500">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
