import { useEffect, useState, useContext } from "react";
import { LikeContext } from "@/contex/LikeContex";
import api from "@/api/Axios";
import { Socket } from "socket.io-client";
import { AuthContext } from "./AuthContex";

type LikeMap = {
  [threadId: number]: boolean;
};

export const LikeProvider = ({ children }: { children: React.ReactNode }) => {
  const [likes, setLikes] = useState<LikeMap>({});

  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  // ✅ Load likes milik user yang login
  useEffect(() => {
    if (!user) {
      setLikes({});
      return;
    }

    const fetchUserLikes = async () => {
      try {
        const res = await api.get("/api/v1/like");

        const likeMap: LikeMap = {};
        res.data.likes.forEach((like: any) => {
          likeMap[like.thread_id] = true;
        });

        setLikes(likeMap);
      } catch (error) {
        console.error("Failed to load likes:", error);
      }
    };

    fetchUserLikes();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const handler = (data: any) => {
      if (!data?.thread_id || !data?.user_id) return;

      if (data.user_id !== user.id) return;

      setLikes((prev) => ({
        ...prev,
        [data.thread_id]: data.liked,
      }));
    };

    Socket.on("like:update", handler);

    return () => {
      Socket.off("like:update", handler);
    };
  }, [user]);

  const likeThread = async (threadId: number) => {
    if (!user) return;

    setLikes((prev) => ({
      ...prev,
      [threadId]: true,
    }));

    try {
      await api.post(`/api/v1/like?thread_id=${threadId}`);
    } catch (err) {
      console.error("Failed to like thread:", err);

      setLikes((prev) => ({
        ...prev,
        [threadId]: false,
      }));
    }
  };

  const unlikeThread = async (threadId: number) => {
    if (!user) return;

    // Optimistic UI
    setLikes((prev) => ({
      ...prev,
      [threadId]: false,
    }));

    try {
      await api.delete(`/api/v1/like?thread_id=${threadId}`);
    } catch (err) {
      console.error("Failed to unlike thread:", err);

      setLikes((prev) => ({
        ...prev,
        [threadId]: true,
      }));
    }
  };

  return <LikeContext.Provider value={{ likes, likeThread, unlikeThread, setLikes }}>{children}</LikeContext.Provider>;
};
