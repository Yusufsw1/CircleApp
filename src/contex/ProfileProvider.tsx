import { useContext, useEffect, useState, type ReactNode } from "react";
import { ProfileContext } from "./ProfileContext";
import { getProfileService, updateProfileService } from "@/services/Services";
import { AuthContext } from "./AuthContex";
import type { Thread, User } from "@/types/Type";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // global

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [userThreads, setUserThreads] = useState<Thread[]>([]);
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

  const refreshUserThreads = async () => {
    if (!token) {
      setUserThreads([]);
      return;
    }

    try {
      const response = await getUserThreadsService();
      setUserThreads(response.data?.threads || response.data || []);
    } catch (err) {
      console.error("Failed to load user threads:", err);
      setUserThreads([]);
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
    refreshUserThreads();
  }, [token]);

  // LISTENER PROFILE UPDATED
  // useEffect(() => {
  //   socket.on("profile-updated", (newProfile) => {
  //     setProfile(newProfile);
  //   });

  //   return () => socket.off("profile-updated");
  // }, []);

  // // LISTENER FOLLOW UPDATE
  // useEffect(() => {
  //   socket.on("follow-changed", (data) => {
  //     setProfile((prev) => {
  //       if (!prev) return prev;

  //       if (prev.id !== data.user_id) return prev;

  //       // update berdasarkan type
  //       return {
  //         ...prev,
  //         follower_count: data.type === "followers" ? data.follower_count : prev.follower_count,

  //         following_count: data.type === "following" ? data.following_count : prev.following_count,
  //       };
  //     });
  //   });

  //   return () => socket.off("follow-changed");
  // }, []);

  useEffect(() => {
    socket.on("profile-updated", (newProfile) => {
      setProfile(newProfile);
    });

    socket.on("follow-changed", (data) => {
      setProfile((prev) => {
        if (!prev) return prev;
        if (prev.id !== data.user_id) return prev;

        return {
          ...prev,
          follower_count: data.type === "followers" ? data.follower_count : prev.follower_count,
          following_count: data.type === "following" ? data.following_count : prev.following_count,
        };
      });
    });

    // ✅ LISTENER UNTUK THREAD UPDATES
    socket.on("new-result", (newThread: Thread) => {
      // Jika thread baru dibuat oleh user ini, tambahkan ke list
      if (newThread.user.id === profile?.id) {
        setUserThreads((prev) => [newThread, ...prev]);
      }
    });

    socket.on("like-updated", (data) => {
      setUserThreads((prev) => prev.map((thread) => (thread.id === data.thread_id ? { ...thread, likes: data.total_likes } : thread)));
    });

    socket.on("new-reply", (data) => {
      setUserThreads((prev) => prev.map((thread) => (thread.id === data.thread_id ? { ...thread, reply: data.replies_count } : thread)));
    });

    return () => {
      socket.off("profile-updated");
      socket.off("follow-changed");
      socket.off("new-result");
      socket.off("like-updated");
      socket.off("new-reply");
    };
  }, [profile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        userThreads, // ✅ TAMBAHKAN DI VALUE
        refreshProfile,
        refreshUserThreads, // ✅ TAMBAHKAN DI VALUE
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
