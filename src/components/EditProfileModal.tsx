// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useState } from "react";
// import { useProfile } from "@/hooks/useProfile";

// export default function EditProfileModal() {
//   const { profile, updateProfile } = useProfile();

//   const [fullName, setFullName] = useState(profile.full_name);
//   const [username, setUsername] = useState(profile.username);
//   const [bio, setBio] = useState(profile.bio || "");
//   const [image, setImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(profile.photo_profile);

//   const handleFile = (e: any) => {
//     const f = e.target.files[0];
//     setImage(f);
//     setPreview(URL.createObjectURL(f));
//   };

//   const handleSubmit = async () => {
//     const fd = new FormData();
//     fd.append("full_name", fullName);
//     fd.append("username", username);
//     fd.append("bio", bio);
//     if (image) fd.append("photo_profile", image);

//     await updateProfile(fd);
//     alert("Profile updated!");
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button className="w-full mt-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl">Edit Profile</Button>
//       </DialogTrigger>

//       <DialogContent className="bg-neutral-900 text-white border-neutral-700">
//         <DialogHeader>
//           <DialogTitle>Edit Profile</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           <div className="flex justify-center">
//             <img src={preview || ""} className="w-20 h-20 rounded-full object-cover" />
//           </div>

//           <Input className="cursor-pointer text-blue-400 hover:text-blue-300" type="file" onChange={handleFile} />

//           <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
//           <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />

//           <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" />
//         </div>

//         <DialogFooter>
//           <Button onClick={handleSubmit} className="bg-blue-500">
//             Save
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// components/EditProfileModal.tsx
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Edit3 } from "lucide-react";

export default function EditProfileModal() {
  const { profile, updateProfile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  // Initialize form data when profile loads or modal opens
  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        bio: profile.bio || "",
      });
      setPreview(profile.photo_profile ? `http://localhost:3000/${profile.photo_profile}` : "");
    }
  }, [profile, isOpen]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("full_name", formData.full_name);
      fd.append("username", formData.username);
      fd.append("bio", formData.bio);
      if (image) {
        fd.append("photo_profile", image);
      }

      await updateProfile(fd);
      setIsOpen(false);

      // Reset form
      setImage(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-neutral-700 text-neutral-800 hover:bg-neutral-800 hover:text-white">
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-neutral-900 text-white border-neutral-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={preview} alt={formData.full_name} />
                <AvatarFallback className="text-lg bg-neutral-800">{formData.full_name[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Full Name</label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
                className="bg-neutral-800 border-neutral-700 text-white focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Username</label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="Enter your username"
                className="bg-neutral-800 border-neutral-700 text-white focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Bio</label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell everyone about yourself"
                className="bg-neutral-800 border-neutral-700 text-white focus:border-blue-500 resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
