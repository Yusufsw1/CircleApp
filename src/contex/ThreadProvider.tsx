import { useEffect, useState, useCallback } from "react";
import { ThreadContext } from "./ThreadContex";
import type { Thread } from "@/types/Type";
import { getAllThreads, getThreadById as apiGetThreadById, getRepliesByThreadId, createReply, type QueryParams, likeThreadService } from "@/services/Services";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export const ThreadProvider = ({ children }: { children: React.ReactNode }) => {
  const [threads, setThreads] = useState<Thread[]>([]);

  const loadThreads = useCallback(async () => {
    const res = await getAllThreads();
    setThreads(res.data.data.threads);
  }, []);

  const getThreadById = useCallback(
    (id: number) => {
      return threads.find((t) => t.id === id) || null;
    },
    [threads]
  );
  const getReplies = async (queryparams: QueryParams) => {
    const result = await getRepliesByThreadId(queryparams);
    console.log(result);
    return result;
  };

  const loadThreadById = useCallback(
    async (id: number) => {
      const existing = threads.find((t) => t.id === id);
      if (existing) return existing;

      const res = await apiGetThreadById(id);
      setThreads((prev) => [...prev, res.data.data]);
      return res.data.data;
    },
    [threads]
  );

  const addReply = async (queryparams: QueryParams, formdata: FormData) => {
    const res = await createReply(queryparams, formdata);
    return res;
  };

  const toggleLike = async (threadId: number, isLiked: boolean) => {
    try {
      // Optimistic update - langsung update UI tanpa tunggu response
      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === threadId
            ? {
                ...thread,
                userLiked: !isLiked,
                likes: isLiked ? thread.likes - 1 : thread.likes + 1,
              }
            : thread
        )
      );

      // Kirim request ke backend
      const response = await likeThreadService(threadId);

      // Jika ada error di backend, rollback
      if (response.code !== 200) {
        setThreads((prev) =>
          prev.map((thread) =>
            thread.id === threadId
              ? {
                  ...thread,
                  userLiked: isLiked,
                  likes: isLiked ? thread.likes : thread.likes - 1,
                }
              : thread
          )
        );
        console.error("Like error:", response.message);
      }
    } catch (error) {
      console.error("Like failed:", error);
      // Rollback jika error
      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === threadId
            ? {
                ...thread,
                userLiked: isLiked,
                likes: isLiked ? thread.likes : thread.likes - 1,
              }
            : thread
        )
      );
    }
  };

  // Socket listeners
  useEffect(() => {
    socket.on("new-result", (t: Thread) => {
      setThreads((prev) => [t, ...prev]);
    });

    socket.on("like-updated", (data: { thread_id: number; total_likes: number; user_id: number }) => {
      setThreads((prev) => prev.map((thread) => (thread.id === data.thread_id ? { ...thread, likes: data.total_likes } : thread)));
    });

    socket.on("new-reply", (data: { thread_id: number; replies_count: number }) => {
      setThreads((prev) => prev.map((thread) => (thread.id === data.thread_id ? { ...thread, reply: data.replies_count } : thread)));
    });

    return () => {
      socket.off("new-result");
      socket.off("like-updated");
      socket.off("new-reply");
    };
  }, []);

  return (
    <ThreadContext.Provider
      value={{
        threads,
        loadThreads,
        getThreadById,
        loadThreadById,
        addReply,
        getReplies,
        toggleLike,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
};
