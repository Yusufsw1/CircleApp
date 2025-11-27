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
      const response = await likeThreadService(threadId);

      if (response.code === 200) {
        const { is_liked, total_likes } = response.data;

        setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, userLiked: is_liked, likes: total_likes } : t)));
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // Socket listeners
  useEffect(() => {
    socket.on("new-result", (t: Thread) => {
      setThreads((prev) => [t, ...prev]);
    });

    socket.on("threadUpdated", (data) => {
      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === data.threadId
            ? {
                ...thread,
                likes: data.total_likes,
              }
            : thread
        )
      );
    });

    socket.on("new-reply", (data: { thread_id: number; replies_count: number }) => {
      setThreads((prev) => prev.map((thread) => (thread.id === data.thread_id ? { ...thread, reply: data.replies_count } : thread)));
    });

    return () => {
      socket.off("new-result");
      socket.off("threadUpdated");
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
