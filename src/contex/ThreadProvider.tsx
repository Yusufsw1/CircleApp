// import { useEffect, useState } from "react";
// import { ThreadContext } from "./ThreadContex";
// import type { Thread } from "@/types/Type";
// import { createReply, getAllThreads, getRepliesByThreadId, likeThreadService, unlikeThreadService, type QueryParams } from "@/services/Services";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000"); // backend socket

// export const ThreadProvider = ({ children }: { children: React.ReactNode }) => {
//   const [threads, setThreads] = useState<Thread[]>([]);
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   const getThreadById = (id: number) => {
//     return threads.find((t) => t.id === id) || null;
//   };

//   const loadThreads = async () => {
//     const res = await getAllThreads();
//     setThreads(res.data.data.threads);
//     console.log("🎯 Setting threads dengan res.data.data langsung");

//     if (res.data.data.length > 0) {
//       console.log("👤 User data dari API:", res.data.data[0].user);
//     }
//   };

//   const addThread = (t: Thread) => {
//     setThreads((prev) => [...prev, t]);
//   };

const getReplies = async (queryparams: QueryParams) => {
  const result = await getRepliesByThreadId(queryparams);
  console.log(result);
  return result;
};

//   const addReply = async (queryparams: QueryParams, formdata: FormData) => {
//     const result = await createReply(queryparams, formdata);
//     console.log(result);
//     // setReply(result);
//     return result;
//   };

//   const handleLike = async (threadId: number) => {
//     const res = await likeThreadService(threadId);

//     setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, likes: res.data.likes, userLiked: true } : t)));
//   };

//   const handleUnlike = async (threadId: number) => {
//     const res = await unlikeThreadService(threadId);

//     setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, likes: res.data.likes, userLiked: false } : t)));
//   };

//   useEffect(() => {
//     const fetchThreads = async () => {
//       try {
//         await loadThreads();
//       } catch (err) {
//         console.error("Gagal load threads", err);
//       }
//     };
//     fetchThreads();
//   }, []);

//   useEffect(() => {
//     socket.on("new-result", (t: Thread) => {
//       setThreads((prev) => [t, ...prev]);
//     });

//     socket.on("like-updated", (data) => {
//       setThreads((prev) => prev.map((t) => (t.id === data.thread_id ? { ...t, likes: data.likes } : t)));
//     });

//     socket.on("new-reply", (data) => {
//       setThreads((prev) => prev.map((t) => (t.id === data.thread_id ? { ...t, replies: t.replies + 1 } : t)));
//     });

//     return () => socket.off();
//   }, []);

//   return <ThreadContext.Provider value={{ threads, addThread, loadThreads, getReplies, getThreadById, addReply, handleLike, handleUnlike }}>{children}</ThreadContext.Provider>;
// };

import { useEffect, useState, useCallback } from "react";
import { ThreadContext } from "./ThreadContex";
import type { Thread } from "@/types/Type";
import { getAllThreads, getThreadById as apiGetThreadById, getRepliesByThreadId, createReply, type QueryParams } from "@/services/Services";
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
      if (isLiked) {
        const res = await unlikeThreadService(threadId);

        setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, likes: res.totalLikes, userLiked: false } : t)));
      } else {
        const res = await likeThreadService(threadId);

        setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, likes: res.totalLikes, userLiked: true } : t)));
      }
    } catch (err) {
      console.error("Toggle like error:", err);
    }
  };

  // Socket listeners
  useEffect(() => {
    socket.on("new-result", (t: Thread) => {
      setThreads((prev) => [t, ...prev]);
    });

    socket.on("like-updated", (data: { thread_id: number; likes: number }) => {
      setThreads((prev) => prev.map((t) => (t.id === data.thread_id ? { ...t, likes: data.likes } : t)));
    });

    socket.on("new-reply", (data: { thread_id: number }) => {
      setThreads((prev) => prev.map((t) => (t.id === data.thread_id ? { ...t, replies: t.replies + 1 } : t)));
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
