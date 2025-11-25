import { useContext, useEffect, useState, type ReactNode } from "react";
import { ProfileContext } from "./ProfileContext";
import { getProfileService, updateProfileService } from "@/services/Services";
import { AuthContext } from "./AuthContex";
import type { User } from "@/types/Type";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // global

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<User | null>(null);
  const { token } = useContext(AuthContext);

  const refreshProfile = async () => {
    if (!token) return setProfile(null);

    try {
      const data = await getProfileService();
      setProfile(data);
    } catch (err) {
      console.error(err);
      setProfile(null);
    }
  };

  const updateProfile = async (formData: FormData) => {
    const res = await updateProfileService(formData);

    const user = res.data?.data ?? res.data; // pastikan ambil yang benar
    setProfile(user);

    // kirim ke socket
    socket.emit("profile-updated", user);

    return user;
  };

  useEffect(() => {
    refreshProfile();
  }, [token]);

  // LISTENER PROFILE UPDATED
  useEffect(() => {
    socket.on("profile-updated", (newProfile) => {
      setProfile(newProfile);
    });

    return () => socket.off("profile-updated");
  }, []);

  // LISTENER FOLLOW UPDATE
  useEffect(() => {
    socket.on("follow-changed", (data) => {
      setProfile((prev) => {
        if (!prev) return prev;

        if (prev.id !== data.user_id) return prev;

        // update berdasarkan type
        return {
          ...prev,
          follower_count: data.type === "followers" ? data.follower_count : prev.follower_count,

          following_count: data.type === "following" ? data.following_count : prev.following_count,
        };
      });
    });

    return () => socket.off("follow-changed");
  }, []);

  return <ProfileContext.Provider value={{ profile, refreshProfile, updateProfile }}>{children}</ProfileContext.Provider>;
};
