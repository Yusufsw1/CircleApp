import { useState } from "react";
import { ThreadContext, type Thread } from "./ThreadContex";
import { getAllThreads } from "@/services/Services";

export const ThreadProvider = ({ children }: { children: React.ReactNode }) => {
  const [threads, setThreads] = useState<Thread[]>([]);

  const loadThreads = async () => {
    const res = await getAllThreads();
    setThreads(res.data.data.threads);
    console.log("🎯 Setting threads dengan res.data.data langsung");
    // setThreads(res.data.data);

    // Debug user data
    if (res.data.data.length > 0) {
      console.log("👤 User data dari API:", res.data.data[0].user);
    }
  };

  const addThread = (t: Thread) => {
    setThreads((prev) => [...prev, t]);
  };

  // WEBSOCKET REALTIME UPDATE

  return <ThreadContext.Provider value={{ threads, addThread, loadThreads }}>{children}</ThreadContext.Provider>;
};
